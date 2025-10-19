const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bibliotecarioRoutes = require('./routes/bibliotecarioRoutes');
const socioRoutes = require('./routes/socioRoutes');
const libroRoutes = require('./routes/libroRoutes');
const ejemplarRoutes = require('./routes/ejemplarRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const multaRoutes = require('./routes/multaRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/bibliotecarios', bibliotecarioRoutes);
app.use('/api/socios', socioRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/ejemplares', ejemplarRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/multas', multaRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Sistema de Biblioteca',
    version: '1.0.0',
    endpoints: {
      bibliotecarios: '/api/bibliotecarios',
      socios: '/api/socios',
      libros: '/api/libros',
      ejemplares: '/api/ejemplares',
      prestamos: '/api/prestamos',
      multas: '/api/multas',
      auth: '/api/auth'
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});


app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}`);
  console.log(`Endpoints disponibles en http://localhost:${PORT}/api`);
});