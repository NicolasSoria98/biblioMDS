const express = require('express');
const router = express.Router();
const socioController = require('../controllers/socioController');

router.get('/', socioController.getAll);
router.get('/:id', socioController.getById);
router.get('/:id/prestamos', socioController.getPrestamosActivos);
router.get('/:id/multas', socioController.getMultasPendientes);
router.post('/', socioController.create);
router.put('/:id', socioController.update);
router.delete('/:id', socioController.delete);

module.exports = router;