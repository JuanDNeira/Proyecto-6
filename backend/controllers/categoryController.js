const Category = require('../models/Category');

// Agregar una nueva categoría
const addCategory = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar categoría', error });
  }
};

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
};

module.exports = {
  addCategory,
  getCategories,
};
