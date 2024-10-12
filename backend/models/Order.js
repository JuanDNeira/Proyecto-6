const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  shippingAddress: { type: String, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    default: 'Pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Order', orderSchema);