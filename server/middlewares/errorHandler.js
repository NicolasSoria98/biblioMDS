const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', {
    mensaje: err.message,
    ruta: req.path,
    metodo: req.method,
    timestamp: new Date().toISOString()
  });

  const dbErrors = {
    'ER_DUP_ENTRY': {
      status: 400,
      message: 'Ya existe un registro con esos datos'
    },
    'ER_NO_REFERENCED_ROW_2': {
      status: 400,
      message: 'El registro referenciado no existe'
    },
    'ER_ROW_IS_REFERENCED_2': {
      status: 400,
      message: 'No se puede eliminar porque tiene registros relacionados'
    },
    'ER_BAD_FIELD_ERROR': {
      status: 400,
      message: 'Campo inválido en la consulta'
    }
  };

  if (err.code && dbErrors[err.code]) {
    return res.status(dbErrors[err.code].status).json({
      success: false,
      error: dbErrors[err.code].message,
      ...(process.env.NODE_ENV === 'development' && { 
        detalles: err.sqlMessage,
        codigo: err.code 
      })
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      mensaje: err.message,
      stack: err.stack 
    })
  });
};

module.exports = errorHandler;