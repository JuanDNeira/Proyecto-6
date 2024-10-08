const mongoose = require('mongoose');

// Esquema de Producto
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  description: {
    type: String,
    required: false,
    maxlength: 500, 
  },
  
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  
  inStock: {
    type: Boolean,
    default: true, 
  },
    
  createdAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
