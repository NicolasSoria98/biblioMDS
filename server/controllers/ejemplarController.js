const Ejemplar = require('../models/Ejemplar');

exports.getAll = async (req, res) => {
  try {
    const ejemplares = await Ejemplar.getAll();
    res.json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const ejemplar = await Ejemplar.getById(req.params.id);
    if (!ejemplar) {
      return res.status(404).json({ error: 'Ejemplar no encontrado' });
    }
    res.json(ejemplar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDisponibles = async (req, res) => {
  try {
    const ejemplares = await Ejemplar.getDisponibles();
    res.json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Ejemplar.create(req.body);
    res.status(201).json({ id, message: 'Ejemplar creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affectedRows = await Ejemplar.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ejemplar no encontrado' });
    }
    res.json({ message: 'Ejemplar actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affectedRows = await Ejemplar.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ejemplar no encontrado' });
    }
    res.json({ message: 'Ejemplar eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const affectedRows = await Ejemplar.cambiarEstado(req.params.id, estado);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Ejemplar no encontrado' });
    }
    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};