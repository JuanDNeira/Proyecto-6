const express = require('express');
const router = express.Router();
const { addCategory, getCategories } = require('../controllers/categoryController');

// Ruta para agregar una categoría
router.post('/', addCategory);

// Ruta para obtener todas las categorías
router.get('/', getCategories);

module.exports = router;
