const { body, param } = require('express-validator');

const bibliotecarioValidator = {
  create: [
    body('nombre')
      .isString().withMessage('El nombre debe ser texto')
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .notEmpty().withMessage('El nombre es requerido'),
    
    body('email')
      .isEmail().withMessage('Email inválido')
      .normalizeEmail()
      .notEmpty().withMessage('El email es requerido'),
    
    body('contrasena')
      .isString()
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
      .notEmpty().withMessage('La contraseña es requerida')
  ],

  update: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido'),
    
    body('nombre')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    
    body('email')
      .optional()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail()
  ],

  getById: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido')
  ],

  delete: [
    param('id')
      .isInt({ min: 1 }).withMessage('ID debe ser un número válido')
  ]
};

module.exports = bibliotecarioValidator;