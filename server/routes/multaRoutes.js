const express = require('express');
const router = express.Router();
const multaController = require('../controllers/multaController');
const multaValidator = require('../middlewares/validators/multaValidator');
const validateRequest = require('../middlewares/validateRequest');

router.get('/', multaController.getAll);

router.get('/pendientes', multaController.getPendientes);

router.get(
  '/socio/:idSocio',
  ...multaValidator.getPorSocio, 
  validateRequest,
  multaController.getPorSocio
);

router.get(
  '/socio/:idSocio/total',
  ...multaValidator.getPorSocio,  
  validateRequest,
  multaController.getTotalPorSocio
);

router.get(
  '/:id',
  ...multaValidator.getById,  
  validateRequest,
  multaController.getById
);

router.post(
  '/',
  ...multaValidator.create, 
  validateRequest,
  multaController.create
);

router.put(
  '/:id/pago',
  ...multaValidator.registrarPago, 
  validateRequest,
  multaController.registrarPago
);

router.delete(
  '/:id',
  ...multaValidator.delete, 
  validateRequest,
  multaController.delete
);

module.exports = router;