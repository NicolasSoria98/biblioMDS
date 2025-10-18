const express = require('express');
const router = express.Router();
const ejemplarController = require('../controllers/ejemplarController');

router.get('/', ejemplarController.getAll);
router.get('/disponibles', ejemplarController.getDisponibles);
router.get('/:id', ejemplarController.getById);
router.post('/', ejemplarController.create);
router.put('/:id', ejemplarController.update);
router.put('/:id/estado', ejemplarController.cambiarEstado);
router.delete('/:id', ejemplarController.delete);

module.exports = router;