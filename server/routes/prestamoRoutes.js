const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.get('/', prestamoController.getAll);
router.get('/activos', prestamoController.getActivos);
router.get('/vencidos', prestamoController.getVencidos);
router.get('/socio/:idSocio', prestamoController.getPorSocio);
router.get('/:id', prestamoController.getById);
router.post('/', prestamoController.create);
router.put('/:id/devolucion', prestamoController.registrarDevolucion);
router.put('/:id/vencido', prestamoController.marcarVencido);

module.exports = router;