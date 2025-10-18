const Socio = require('../models/Socio');

exports.getAll = async (req, res) => {
  try {
    const socios = await Socio.getAll();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const socio = await Socio.getById(req.params.id);
    if (!socio) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json(socio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Verificar si el DNI ya existe
    const socioExistente = await Socio.getByDni(req.body.dni);
    if (socioExistente) {
      return res.status(400).json({ error: 'Ya existe un socio con ese DNI' });
    }
    
    const id = await Socio.create(req.body);
    res.status(201).json({ id, message: 'Socio registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const affectedRows = await Socio.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json({ message: 'Socio actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affectedRows = await Socio.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json({ message: 'Socio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPrestamosActivos = async (req, res) => {
  try {
    const prestamos = await Socio.getPrestamosActivos(req.params.id);
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMultasPendientes = async (req, res) => {
  try {
    const multas = await Socio.getMultasPendientes(req.params.id);
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
