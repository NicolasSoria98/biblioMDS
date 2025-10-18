const Libro = require('../models/Libro');

exports.getAll = async (req, res) => {
  try {
    const libros = await Libro.getAll();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const libro = await Libro.getById(req.params.id);
    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Verificar si el ISBN ya existe
    const libroExistente = await Libro.getByIsbn(req.body.isbn);
    if (libroExistente) {
      return res.status(400).json({ error: 'Ya existe un libro con ese ISBN' });
    }
    
    const id = await Libro.create(req.body);
    res.status(201).json({ id, message: 'Libro creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affectedRows = await Libro.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affectedRows = await Libro.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEjemplares = async (req, res) => {
  try {
    const ejemplares = await Libro.getEjemplares(req.params.id);
    res.json(ejemplares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDisponibilidad = async (req, res) => {
  try {
    const disponibilidad = await Libro.getDisponibilidad(req.params.id);
    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
