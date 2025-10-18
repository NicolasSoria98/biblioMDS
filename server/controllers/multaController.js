const Multa = require('../models/Multa');

exports.getAll = async (req, res) => {
  try {
    const multas = await Multa.getAll();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const multa = await Multa.getById(req.params.id);
    if (!multa) {
      return res.status(404).json({ error: 'Multa no encontrada' });
    }
    res.json(multa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendientes = async (req, res) => {
  try {
    const multas = await Multa.getPendientes();
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPorSocio = async (req, res) => {
  try {
    const multas = await Multa.getPorSocio(req.params.idSocio);
    res.json(multas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await Multa.create(req.body);
    res.status(201).json({ id, message: 'Multa registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registrarPago = async (req, res) => {
  try {
    const { fecha_pago } = req.body;
    const affectedRows = await Multa.registrarPago(req.params.id, fecha_pago);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Multa no encontrada' });
    }
    res.json({ message: 'Pago registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const affectedRows = await Multa.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Multa no encontrada' });
    }
    res.json({ message: 'Multa eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTotalPorSocio = async (req, res) => {
  try {
    const total = await Multa.getTotalPorSocio(req.params.idSocio);
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};