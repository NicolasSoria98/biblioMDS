const Prestamo = require('../models/Prestamo');
const Ejemplar = require('../models/Ejemplar');

exports.getAll = async (req, res) => {
  try {
    const prestamos = await Prestamo.getAll();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const prestamo = await Prestamo.getById(req.params.id);
    if (!prestamo) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActivos = async (req, res) => {
  try {
    const prestamos = await Prestamo.getActivos();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVencidos = async (req, res) => {
  try {
    const prestamos = await Prestamo.getVencidos();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Verificar que el ejemplar esté disponible
    const ejemplar = await Ejemplar.getById(req.body.id_ejemplar);
    if (!ejemplar) {
      return res.status(404).json({ error: 'Ejemplar no encontrado' });
    }
    if (ejemplar.estado !== 'disponible') {
      return res.status(400).json({ error: 'El ejemplar no está disponible' });
    }
    
    const id = await Prestamo.create(req.body);
    res.status(201).json({ id, message: 'Préstamo registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registrarDevolucion = async (req, res) => {
  try {
    const { fecha_devolucion_real } = req.body;
    const affectedRows = await Prestamo.registrarDevolucion(req.params.id, fecha_devolucion_real);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json({ message: 'Devolución registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.marcarVencido = async (req, res) => {
  try {
    const affectedRows = await Prestamo.marcarVencido(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }
    res.json({ message: 'Préstamo marcado como vencido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPorSocio = async (req, res) => {
  try {
    const prestamos = await Prestamo.getPorSocio(req.params.idSocio);
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};