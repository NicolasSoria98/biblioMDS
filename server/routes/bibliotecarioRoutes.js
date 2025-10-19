const express = require('express');
const router = express.Router();
const bibliotecarioController = require('../controllers/bibliotecarioController');

router.get('/', bibliotecarioController.getAll);
router.get('/:id', bibliotecarioController.getById);
router.post('/', bibliotecarioController.create);
router.put('/:id', bibliotecarioController.update);
router.delete('/:id', bibliotecarioController.delete);

module.exports = router;