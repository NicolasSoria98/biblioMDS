class ApiResponse {
  static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error en la operación', statusCode = 500, details = null) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      ...(details && { detalles: details })
    });
  }

  static notFound(res, recurso = 'Recurso') {
    return res.status(404).json({
      success: false,
      error: `${recurso} no encontrado`
    });
  }

  static created(res, data, message = 'Recurso creado exitosamente') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  }
}

module.exports = ApiResponse;