const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

router.get('/', libroController.getAll);
router.get('/:id', libroController.getById);
router.get('/:id/ejemplares', libroController.getEjemplares);
router.get('/:id/disponibilidad', libroController.getDisponibilidad);
router.post('/', libroController.create);
router.put('/:id', libroController.update);
router.delete('/:id', libroController.delete);

module.exports = router;