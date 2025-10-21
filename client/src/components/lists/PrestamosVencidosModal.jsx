import { useState, useEffect } from 'react';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';
import { api, date, filter, notification } from '../../../../server/services/Facade';

function PrestamosVencidosModal({ onClose }) {
  const [prestamos, setPrestamos] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      const data = await api.obtenerPrestamosVencidos();
      const prestamosData = data.data || data;
      
      setPrestamos(prestamosData);
      setFilteredPrestamos(prestamosData);
      
      if (prestamosData.length > 0) {
        notification.warning(`Hay ${prestamosData.length} préstamos vencidos`);
      }
    } catch (err) {
      const errorMsg = 'Error al cargar los préstamos vencidos';
      setError(errorMsg);
      notification.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    const filtered = filter.filterByMultipleFields(prestamos, {
      titulo: filterValues.titulo,
      nombre_socio: filterValues.nombre_socio
    });

    setFilteredPrestamos(filtered);
  };

  const columns = [
    { 
      header: 'ID', 
      field: 'id', 
      width: '60px' 
    },
    { 
      header: 'Libro', 
      field: 'titulo', 
      width: 'auto' 
    },
    { 
      header: 'Socio', 
      field: 'nombre_socio', 
      width: 'auto' 
    },
    { 
      header: 'Fecha Préstamo', 
      field: 'fecha_prestamo',
      width: '130px',
      render: (row) => date.formatDate(row.fecha_prestamo)
    },
    { 
      header: 'Fecha Estimada', 
      field: 'fecha_devolucion_estimada',
      width: '150px',
      render: (row) => date.formatDate(row.fecha_devolucion_estimada)
    },
    { 
      header: 'Días Vencido', 
      field: 'dias_retraso',
      width: '120px',
      render: (row) => (
        <span style={{ 
          color: 'var(--color-error)', 
          fontWeight: 'bold' 
        }}>
          +{row.dias_retraso}
        </span>
      )
    }
  ];

  const filters = [
    { 
      field: 'titulo', 
      label: 'Título del Libro', 
      placeholder: 'Buscar por título...' 
    },
    { 
      field: 'nombre_socio', 
      label: 'Nombre del Socio', 
      placeholder: 'Buscar por socio...' 
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Cargando préstamos vencidos...
      </div>
    );
  }

  return (
    <div className="modal-list-content">
      {error && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <div style={{ 
        marginBottom: '1rem', 
        fontSize: '0.95rem', 
        color: 'var(--color-error)' 
      }}>
        ⚠️ <strong>Total:</strong> {filteredPrestamos.length} préstamos vencidos
        {filteredPrestamos.length !== prestamos.length && (
          <span style={{ marginLeft: '0.5rem' }}>
            (filtrados de {prestamos.length})
          </span>
        )}
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <Table
        columns={columns}
        data={filteredPrestamos}
        emptyMessage="No hay préstamos vencidos"
      />

      <div className="modal-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default PrestamosVencidosModal;