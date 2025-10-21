const asyncHandler = require('../middlewares/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Bibliotecario = require('../models/Bibliotecario');

exports.getAll = asyncHandler(async (req, res) => {
  const bibliotecarios = await Bibliotecario.getAll();
  ApiResponse.success(res, bibliotecarios, 'Bibliotecarios obtenidos exitosamente');
});

exports.getById = asyncHandler(async (req, res) => {
  const bibliotecario = await Bibliotecario.getById(req.params.id);
  
  if (!bibliotecario) {
    return ApiResponse.notFound(res, 'Bibliotecario');
  }
  
  ApiResponse.success(res, bibliotecario, 'Bibliotecario encontrado');
});

exports.create = asyncHandler(async (req, res) => {
  const id = await Bibliotecario.create(req.body);
  ApiResponse.created(res, { id }, 'Bibliotecario creado exitosamente');
});

exports.update = asyncHandler(async (req, res) => {
  const affectedRows = await Bibliotecario.update(req.params.id, req.body);
  
  if (affectedRows === 0) {
    return ApiResponse.notFound(res, 'Bibliotecario');
  }
  
  ApiResponse.success(res, null, 'Bibliotecario actualizado exitosamente');
});

exports.delete = asyncHandler(async (req, res) => {
  const affectedRows = await Bibliotecario.delete(req.params.id);
  
  if (affectedRows === 0) {
    return ApiResponse.notFound(res, 'Bibliotecario');
  }
  
  ApiResponse.success(res, null, 'Bibliotecario eliminado exitosamente');
});