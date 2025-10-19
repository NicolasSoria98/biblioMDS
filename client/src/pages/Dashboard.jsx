import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Modal from '../components/common/Modal';
import RegistrarSocioForm from '../components/forms/RegistrarSocioForm';
import RealizarPrestamoForm from '../components/forms/RealizarPrestamoForm';
import GestionarDevolucionForm from '../components/forms/GestionarDevolucionForm';
import ListarLibrosModal from '../components/lists/ListarLibrosModal';
import ListarSociosModal from '../components/lists/ListarSociosModal';
import ListarMultasModal from '../components/lists/ListarMultasModal';
import PrestamosActivosModal from '../components/lists/PrestamosActivosModal';
import PrestamosVencidosModal from '../components/lists/PrestamosVencidosModal';
import GestionarEjemplaresModal from '../components/lists/GestionarEjemplaresModal';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Estados para los modales principales
  const [modalRegistrarSocio, setModalRegistrarSocio] = useState(false);
  const [modalRealizarPrestamo, setModalRealizarPrestamo] = useState(false);
  const [modalGestionarDevolucion, setModalGestionarDevolucion] = useState(false);
  
  // Estados para los modales secundarios
  const [modalListarLibros, setModalListarLibros] = useState(false);
  const [modalListarSocios, setModalListarSocios] = useState(false);
  const [modalListarMultas, setModalListarMultas] = useState(false);
  const [modalPrestamosActivos, setModalPrestamosActivos] = useState(false);
  const [modalPrestamosVencidos, setModalPrestamosVencidos] = useState(false);
  const [modalGestionarEjemplares, setModalGestionarEjemplares] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Handlers de éxito para cada modal
  const handleSuccessRegistrarSocio = (data) => {
    setModalRegistrarSocio(false);
    setSuccessMessage(`Socio registrado exitosamente. Número de socio: ${data.id}`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessRealizarPrestamo = (data) => {
    setModalRealizarPrestamo(false);
    setSuccessMessage('Préstamo registrado exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessGestionarDevolucion = (data) => {
    setModalGestionarDevolucion(false);
    setSuccessMessage(data.message || 'Devolución procesada exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleSuccessEjemplar = (data) => {
    setSuccessMessage(data.message || 'Estado actualizado exitosamente');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Funciones principales
  const mainFunctions = [
    {
      id: 1,
      icon: '👤',
      title: 'Registrar Socio',
      description: 'Dar de alta un nuevo socio en el sistema',
      action: () => setModalRegistrarSocio(true)
    },
    {
      id: 2,
      icon: '📖',
      title: 'Realizar Préstamo',
      description: 'Registrar el préstamo de un libro a un socio',
      action: () => setModalRealizarPrestamo(true)
    },
    {
      id: 3,
      icon: '↩️',
      title: 'Gestionar Devoluciones',
      description: 'Procesar la devolución de libros prestados',
      action: () => setModalGestionarDevolucion(true)
    }
  ];

  // Funciones secundarias
  const secondaryFunctions = [
    {
      id: 1,
      icon: '📚',
      title: 'Listar Libros',
      description: 'Ver catálogo',
      action: () => setModalListarLibros(true)
    },
    {
      id: 2,
      icon: '👥',
      title: 'Listar Socios',
      description: 'Ver socios',
      action: () => setModalListarSocios(true)
    },
    {
      id: 3,
      icon: '💰',
      title: 'Listar Multas',
      description: 'Ver multas',
      action: () => setModalListarMultas(true)
    },
    {
      id: 4,
      icon: '📋',
      title: 'Préstamos Activos',
      description: 'Ver préstamos',
      action: () => setModalPrestamosActivos(true)
    },
    {
      id: 5,
      icon: '📦',
      title: 'Gestionar Ejemplares',
      description: 'Ver ejemplares',
      action: () => setModalGestionarEjemplares(true)
    },
    {
      id: 6,
      icon: '⚠️',
      title: 'Préstamos Vencidos',
      description: 'Ver vencidos',
      action: () => setModalPrestamosVencidos(true)
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-welcome">
          <span className="header-icon">📚</span>
          <div className="header-text">
            <h1>Bienvenido al sistema, {user?.nombre || 'Usuario'}</h1>
            <p>Sistema de Gestión Bibliotecaria</p>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main className="dashboard-content">
        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="success-message" style={{ marginBottom: '2rem' }}>
            ✓ {successMessage}
          </div>
        )}

        {/* Funciones principales */}
        <section className="main-section">
          <h2 className="section-title">Funciones Principales</h2>
          <div className="main-cards">
            {mainFunctions.map((func) => (
              <div
                key={func.id}
                className="main-card"
                onClick={func.action}
              >
                <span className="main-card-icon">{func.icon}</span>
                <h3>{func.title}</h3>
                <p>{func.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Funciones secundarias */}
        <section className="secondary-section">
          <div className="secondary-cards">
            {secondaryFunctions.map((func) => (
              <div
                key={func.id}
                className="secondary-card"
                onClick={func.action}
              >
                <span className="secondary-card-icon">{func.icon}</span>
                <h4>{func.title}</h4>
                <p>{func.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 Sistema de Gestión Bibliotecaria desarrollado por Nicolás Soria</p>
      </footer>

      {/* Modales Principales */}
      <Modal
        isOpen={modalRegistrarSocio}
        onClose={() => setModalRegistrarSocio(false)}
        title="Registrar Nuevo Socio"
        size="medium"
      >
        <RegistrarSocioForm
          onSuccess={handleSuccessRegistrarSocio}
          onCancel={() => setModalRegistrarSocio(false)}
        />
      </Modal>

      <Modal
        isOpen={modalRealizarPrestamo}
        onClose={() => setModalRealizarPrestamo(false)}
        title="Realizar Préstamo"
        size="medium"
      >
        <RealizarPrestamoForm
          onSuccess={handleSuccessRealizarPrestamo}
          onCancel={() => setModalRealizarPrestamo(false)}
        />
      </Modal>

      <Modal
        isOpen={modalGestionarDevolucion}
        onClose={() => setModalGestionarDevolucion(false)}
        title="Gestionar Devolución"
        size="large"
      >
        <GestionarDevolucionForm
          onSuccess={handleSuccessGestionarDevolucion}
          onCancel={() => setModalGestionarDevolucion(false)}
        />
      </Modal>

      {/* Modales Secundarios */}
      <Modal
        isOpen={modalListarLibros}
        onClose={() => setModalListarLibros(false)}
        title="📚 Catálogo de Libros"
        size="large"
      >
        <ListarLibrosModal onClose={() => setModalListarLibros(false)} />
      </Modal>

      <Modal
        isOpen={modalListarSocios}
        onClose={() => setModalListarSocios(false)}
        title="👥 Listado de Socios"
        size="large"
      >
        <ListarSociosModal onClose={() => setModalListarSocios(false)} />
      </Modal>

      <Modal
        isOpen={modalListarMultas}
        onClose={() => setModalListarMultas(false)}
        title="💰 Listado de Multas"
        size="large"
      >
        <ListarMultasModal onClose={() => setModalListarMultas(false)} />
      </Modal>

      <Modal
        isOpen={modalPrestamosActivos}
        onClose={() => setModalPrestamosActivos(false)}
        title="📋 Préstamos Activos"
        size="large"
      >
        <PrestamosActivosModal onClose={() => setModalPrestamosActivos(false)} />
      </Modal>

      <Modal
        isOpen={modalPrestamosVencidos}
        onClose={() => setModalPrestamosVencidos(false)}
        title="⚠️ Préstamos Vencidos"
        size="large"
      >
        <PrestamosVencidosModal onClose={() => setModalPrestamosVencidos(false)} />
      </Modal>

      <Modal
        isOpen={modalGestionarEjemplares}
        onClose={() => setModalGestionarEjemplares(false)}
        title="📦 Gestionar Ejemplares"
        size="large"
      >
        <GestionarEjemplaresModal 
          onClose={() => setModalGestionarEjemplares(false)}
          onSuccess={handleSuccessEjemplar}
        />
      </Modal>
    </div>
  );
}

export default Dashboard;