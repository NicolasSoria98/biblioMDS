import { useState, useEffect } from 'react';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';
import { api, date, filter, notification } from '../../../../server/services/Facade';
import multasObservable from '../../../../server/services/MultasObservable';
import '../../styles/ListarMultasModal.css';

function ListarMultasModal({ onClose }) {
  const [multas, setMultas] = useState([]);
  const [filteredMultas, setFilteredMultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMulta, setSelectedMulta] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchMultas();
  }, []);

  const fetchMultas = async () => {
    try {
      setLoading(true);
      const response = await api.obtenerMultas();
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      
      setMultas(data);
      setFilteredMultas(data);
      
      // 📢 Actualizar contador en el observable
      const multasImpagas = data.filter(m => m.estado === 'pendiente').length;
      multasObservable.setMultasImpagasCount(multasImpagas);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las multas');
      notification.error('Error al cargar las multas');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    const filtered = filter.filterByMultipleFields(multas, {
      nombre_socio: filterValues.nombre_socio
    });

    const finalFiltered = filterValues.estado && filterValues.estado !== 'todas'
      ? filtered.filter(m => m.estado === filterValues.estado)
      : filtered;

    setFilteredMultas(finalFiltered);
  };

  const handleRegistrarPago = (multa) => {
    setSelectedMulta(multa);
    setShowConfirmModal(true);
  };

  const confirmPago = async () => {
    setProcessingPayment(true);
    setError('');
    
    try {
      const fechaPago = new Date().toISOString().split('T')[0];
      
      await api.registrarPagoMulta(selectedMulta.id, fechaPago);

      // Actualizar multa localmente
      const multaActualizada = { 
        ...selectedMulta, 
        estado: 'pagada', 
        fecha_pago: fechaPago 
      };

      const updatedMultas = multas.map(m =>
        m.id === selectedMulta.id ? multaActualizada : m
      );
      
      const updatedFilteredMultas = filteredMultas.map(m =>
        m.id === selectedMulta.id ? multaActualizada : m
      );
      
      setMultas(updatedMultas);
      setFilteredMultas(updatedFilteredMultas);
      
      // 📢 NOTIFICAR AL OBSERVABLE (esto actualiza el contador del botón)
      multasObservable.decrementMultasImpagas();
      
      setShowConfirmModal(false);
      setSelectedMulta(null);
      
      notification.success('✅ Pago registrado exitosamente');
    } catch (err) {
      console.error('Error al registrar pago:', err);
      const errorMsg = 'Error al registrar el pago: ' + (err.response?.data?.error || err.message);
      setError(errorMsg);
      notification.error(errorMsg);
      setShowConfirmModal(false);
      setSelectedMulta(null);
    } finally {
      setProcessingPayment(false);
    }
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Socio', field: 'nombre_socio', width: 'auto' },
    { header: 'DNI', field: 'dni', width: '120px' },
    { 
      header: 'Monto', 
      field: 'monto', 
      width: '100px', 
      render: (row) => `$${parseFloat(row.monto).toFixed(2)}` 
    },
    { header: 'Motivo', field: 'motivo', width: 'auto' },
    { 
      header: 'Fecha', 
      field: 'fecha_multa',
      width: '120px',
      render: (row) => date.formatDate(row.fecha_multa)
    },
    { 
      header: 'Estado', 
      field: 'estado',
      width: '120px',
      render: (row) => (
        <span className={`status-badge status-${row.estado}`}>
          {row.estado === 'pagada' ? '✓ Pagada' : '⏳ Pendiente'}
        </span>
      )
    },
    {
      header: 'Acción',
      field: 'action',
      width: '130px',
      render: (row) => row.estado === 'pendiente' ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRegistrarPago(row);
          }}
          className="btn-pagar"
        >
          💳 Pagar
        </button>
      ) : (
        <span className="no-action">—</span>
      )
    }
  ];

  const filters = [
    { 
      field: 'nombre_socio', 
      label: 'Nombre del Socio', 
      placeholder: 'Buscar por nombre...',
      type: 'text'
    },
    {
      field: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'todas', label: 'Todas' },
        { value: 'pendiente', label: 'Pendientes' },
        { value: 'pagada', label: 'Pagadas' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-icon">⏳</div>
        <p>Cargando multas...</p>
      </div>
    );
  }

  const safeFilteredMultas = Array.isArray(filteredMultas) ? filteredMultas : [];
  const multasPendientes = safeFilteredMultas.filter(m => m.estado === 'pendiente').length;
  const totalPendiente = safeFilteredMultas
    .filter(m => m.estado === 'pendiente')
    .reduce((sum, m) => sum + parseFloat(m.monto), 0);

  return (
    <div className="modal-list-content">
      {error && <div className="error-message">{error}</div>}
      
      <div className="multas-summary">
        <div className="summary-card">
          <div className="summary-label">Total multas</div>
          <div className="summary-value">{safeFilteredMultas.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Pendientes</div>
          <div className="summary-value warning">{multasPendientes}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total a cobrar</div>
          <div className="summary-value danger">${totalPendiente.toFixed(2)}</div>
        </div>
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <div className="table-wrapper">
        <Table
          columns={columns}
          data={safeFilteredMultas}
          emptyMessage="No se encontraron multas"
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>

      {showConfirmModal && selectedMulta && (
        <div className="confirm-modal-overlay" onClick={(e) => {
          if (e.target.className === 'confirm-modal-overlay') {
            setShowConfirmModal(false);
            setSelectedMulta(null);
          }
        }}>
          <div className="confirm-modal">
            <h3 className="confirm-modal-title">💳 Confirmar Pago de Multa</h3>
            
            <div className="confirm-modal-details">
              <p><strong>Socio:</strong> {selectedMulta.nombre_socio}</p>
              <p><strong>DNI:</strong> {selectedMulta.dni}</p>
              <p><strong>Motivo:</strong> {selectedMulta.motivo || 'Sin motivo especificado'}</p>
              <p className="confirm-modal-amount">
                <strong>Monto:</strong> ${parseFloat(selectedMulta.monto).toFixed(2)}
              </p>
            </div>

            <p className="confirm-modal-question">
              ¿Confirma que desea marcar esta multa como pagada?
            </p>

            <div className="confirm-modal-actions">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedMulta(null);
                }}
                disabled={processingPayment}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPago}
                disabled={processingPayment}
                className="btn btn-success"
              >
                {processingPayment ? '⏳ Procesando...' : '✓ Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarMultasModal;