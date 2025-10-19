const express = require('express');
const router = express.Router();
const multaController = require('../controllers/multaController');

router.get('/', multaController.getAll);
router.get('/pendientes', multaController.getPendientes);
router.get('/socio/:idSocio', multaController.getPorSocio);
router.get('/socio/:idSocio/total', multaController.getTotalPorSocio);
router.get('/:id', multaController.getById);
router.post('/', multaController.create);
router.put('/:id/pago', multaController.registrarPago);
router.delete('/:id', multaController.delete);

module.exports = router;