const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      campo: err.path,
      mensaje: err.msg,
      valor: err.value
    }));

    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      detalles: formattedErrors
    });
  }
  
  next();
};

module.exports = validateRequest;