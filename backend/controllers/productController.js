const mongoose = require('mongoose');
const Product = require('../models/Product'); 
const Category = require('../models/Category');

// Crear un nuevo producto
const addProduct = async (req, res) => {
  const { name, price, quantity, description, category } = req.body;
  
  try {
    // Verifica si la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoría no válida' });
    }

    // Crear el producto
    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      category,
      inStock: quantity > 0
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto', error: error.message });
  }
};

// Obtener productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, description, category } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar los campos
    product.name = name || product.name;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.description = description || product.description;
    product.category = category || product.category;
    product.inStock = product.quantity > 0;

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  console.log('Intentando eliminar producto con ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('ID de producto no válido:', id);
    return res.status(400).json({ message: 'ID de producto no válido' });
  }

  try {
    console.log('Buscando producto en la base de datos...');
    const product = await Product.findById(id);

    if (!product) {
      console.log('Producto no encontrado en la base de datos');
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    console.log('Producto encontrado, intentando eliminar...');
    const result = await Product.findByIdAndDelete(id);
    
    if (result) {
      console.log('Producto eliminado correctamente');
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } else {
      console.log('Error al eliminar el producto: resultado nulo');
      res.status(500).json({ message: 'Error al eliminar el producto: resultado nulo' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el producto', 
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};