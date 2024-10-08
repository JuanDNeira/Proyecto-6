const mongoose = require('mongoose');

// Esquema de Categoría
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  description: {
    type: String,
    maxlength: 500,
  },
});

module.exports = mongoose.model('Category', categorySchema);
