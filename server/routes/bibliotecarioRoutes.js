const express = require('express');
const router = express.Router();
const bibliotecarioController = require('../controllers/bibliotecarioController');
const bibliotecarioValidator = require('../middlewares/validators/bibliotecarioValidator');
const validateRequest = require('../middlewares/validateRequest');

router.get('/', bibliotecarioController.getAll);

router.get(
  '/:id',
  bibliotecarioValidator.getById,
  validateRequest,
  bibliotecarioController.getById
);

router.post(
  '/',
  bibliotecarioValidator.create,
  validateRequest,
  bibliotecarioController.create
);

router.put(
  '/:id',
  bibliotecarioValidator.update,
  validateRequest,
  bibliotecarioController.update
);

router.delete(
  '/:id',
  bibliotecarioValidator.delete,
  validateRequest,
  bibliotecarioController.delete
);

module.exports = router;