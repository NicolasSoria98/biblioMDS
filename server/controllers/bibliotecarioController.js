const Bibliotecario = require('../models/Bibliotecario');

exports.getAll = async (req, res) => {
  try {
    const bibliotecarios = await Bibliotecario.getAll();
    res.json(bibliotecarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const bibliotecario = await Bibliotecario.getById(req.params.id);
    if (!bibliotecario) {
      return res.status(404).json({ error: 'Bibliotecario no encontrado' });
    }
    res.json(bibliotecario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Bibliotecario.create(req.body);
    res.status(201).json({ id, message: 'Bibliotecario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affectedRows = await Bibliotecario.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Bibliotecario no encontrado' });
    }
    res.json({ message: 'Bibliotecario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affectedRows = await Bibliotecario.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Bibliotecario no encontrado' });
    }
    res.json({ message: 'Bibliotecario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};