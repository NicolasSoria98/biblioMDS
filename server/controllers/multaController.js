const asyncHandler = require('../middlewares/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Multa = require('../models/Multa');

exports.getAll = asyncHandler(async (req, res) => {
  const multas = await Multa.getAll();
  ApiResponse.success(res, multas, 'Multas obtenidas exitosamente');
});

exports.getById = asyncHandler(async (req, res) => {
  const multa = await Multa.getById(req.params.id);
  
  if (!multa) {
    return ApiResponse.notFound(res, 'Multa');
  }
  
  ApiResponse.success(res, multa, 'Multa encontrada');
});

exports.getPendientes = asyncHandler(async (req, res) => {
  const multas = await Multa.getPendientes();
  ApiResponse.success(res, multas, 'Multas pendientes obtenidas');
});

exports.getPorSocio = asyncHandler(async (req, res) => {
  const multas = await Multa.getPorSocio(req.params.idSocio);
  ApiResponse.success(res, multas, `Multas del socio obtenidas`);
});

exports.create = asyncHandler(async (req, res) => {
  const id = await Multa.create(req.body);
  ApiResponse.created(res, { id }, 'Multa registrada exitosamente');
});

exports.registrarPago = asyncHandler(async (req, res) => {
  const { fecha_pago } = req.body;
  const affectedRows = await Multa.registrarPago(req.params.id, fecha_pago);
  
  if (affectedRows === 0) {
    return ApiResponse.notFound(res, 'Multa');
  }
  
  ApiResponse.success(res, null, 'Pago registrado exitosamente');
});

exports.delete = asyncHandler(async (req, res) => {
  const affectedRows = await Multa.delete(req.params.id);
  
  if (affectedRows === 0) {
    return ApiResponse.notFound(res, 'Multa');
  }
  
  ApiResponse.success(res, null, 'Multa eliminada exitosamente');
});

exports.getTotalPorSocio = asyncHandler(async (req, res) => {
  const total = await Multa.getTotalPorSocio(req.params.idSocio);
  ApiResponse.success(res, { total }, 'Total calculado');
});