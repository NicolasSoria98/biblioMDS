import { useState, useEffect } from 'react';
import multasObservable from '../../../../server/services/Facade';
import { api } from '../../../../server/services/MultasObservable';
import ListarMultasModal from './ListarMultasModal';
import '../../styles/MultasButton';

function MultasButton() {
  const [showModal, setShowModal] = useState(false);
  const [multasImpagas, setMultasImpagas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMultasImpagasCount();

    const unsubscribe = multasObservable.subscribe((data) => {
      console.log('🔔 Evento recibido en botón:', data);
      
      if (data.type === 'MULTAS_COUNT_UPDATED' || 
          data.type === 'MULTA_PAGADA' || 
          data.type === 'MULTA_CREADA') {
        setMultasImpagas(data.count);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchMultasImpagasCount = async () => {
    try {
      setLoading(true);
      const response = await api.obtenerMultasImpagas();
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response) ? response : [];
      
      const count = data.length;
      
      multasObservable.setMultasImpagasCount(count);
      setMultasImpagas(count);
    } catch (err) {
      console.error('Error al cargar multas impagas:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        className="multas-button" 
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        💳 Multas
        {multasImpagas > 0 && (
          <span className="multas-badge">
            {multasImpagas}
          </span>
        )}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gestión de Multas</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <ListarMultasModal onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default MultasButton;