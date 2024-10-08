const express = require('express');
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

// Ruta para agregar un producto
router.post('/', addProduct);

// Ruta para obtener la lista de productos
router.get('/', getProducts);

// Ruta para actualizar un producto
router.put('/:id', updateProduct);

// Ruta para eliminar un producto
router.delete('/:id', deleteProduct);

module.exports = router;
