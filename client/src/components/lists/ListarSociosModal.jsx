import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../common/Table';
import SearchFilter from '../common/SearchFilter';

function ListarSociosModal({ onClose }) {
  const [socios, setSocios] = useState([]);
  const [filteredSocios, setFilteredSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/socios');
      setSocios(response.data);
      setFilteredSocios(response.data);
    } catch (err) {
      setError('Error al cargar los socios');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    let filtered = [...socios];

    if (filterValues.nombre) {
      filtered = filtered.filter(socio =>
        socio.nombre.toLowerCase().includes(filterValues.nombre.toLowerCase())
      );
    }

    if (filterValues.numero_socio) {
      filtered = filtered.filter(socio =>
        socio.id.toString().includes(filterValues.numero_socio)
      );
    }

    setFilteredSocios(filtered);
  };

  const columns = [
    { header: 'Nº Socio', field: 'id', width: '100px' },
    { header: 'Nombre', field: 'nombre', width: 'auto' },
    { header: 'DNI', field: 'dni', width: '120px' },
    { header: 'Email', field: 'email', width: 'auto' },
    { 
      header: 'Fecha Inscripción', 
      field: 'fecha_inscripcion',
      width: '150px',
      render: (row) => new Date(row.fecha_inscripcion).toLocaleDateString()
    }
  ];

  const filters = [
    { field: 'nombre', label: 'Nombre', placeholder: 'Buscar por nombre...' },
    { field: 'numero_socio', label: 'Número de Socio', placeholder: 'Buscar por número...' }
  ];

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando socios...</div>;
  }

  return (
    <div className="modal-list-content">
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
        Total: {filteredSocios.length} socios
      </div>

      <SearchFilter filters={filters} onFilter={handleFilter} />

      <Table
        columns={columns}
        data={filteredSocios}
        emptyMessage="No se encontraron socios"
      />

      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default ListarSociosModal;