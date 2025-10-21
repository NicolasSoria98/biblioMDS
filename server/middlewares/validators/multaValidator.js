const { body, param } = require('express-validator');

const multaValidator = {
  create: [
    body('id_socio')
      .exists().withMessage('ID del socio es requerido')
      .toInt()
      .isInt({ min: 1 }).withMessage('ID del socio debe ser un número válido'),
    
    body('id_prestamo')
      .optional({ nullable: true, checkFalsy: true })
      .toInt()
      .isInt({ min: 1 }).withMessage('ID del préstamo debe ser un número válido'),
    
    body('monto')
      .exists().withMessage('El monto es requerido')
      .toFloat()
      .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
    
    body('motivo')
      .optional({ checkFalsy: true })
      .isString().withMessage('El motivo debe ser texto')
      .trim()
      .isLength({ max: 500 }).withMessage('El motivo no debe exceder 500 caracteres')
  ],

  registrarPago: [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido'),
    
    body('fecha_pago')
      .isISO8601().withMessage('Fecha inválida (formato: YYYY-MM-DD)')
      .notEmpty().withMessage('La fecha de pago es requerida')
      .custom((value) => {
        const fecha = new Date(value);
        const hoy = new Date();
        if (fecha > hoy) {
          throw new Error('La fecha de pago no puede ser futura');
        }
        return true;
      })
  ],

  getById: [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido')
  ],

  getPorSocio: [
    param('id_socio')
      .toInt()
      .isInt({ min: 1 }).withMessage('ID del socio debe ser un número válido')
  ],

  delete: [
    param('id')
      .toInt()
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido')
  ]
};

module.exports = multaValidator;