const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;

    const detailedItems = items.map(item => ({
      product: item.product._id, 
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));

    const newOrder = new Order({
      items: detailedItems,
      shippingAddress,
      total
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
});

// Obtener el historial de pedidos de un usuario (puedes ajustar esto para que obtenga por usuario autenticado)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
});

module.exports = router;
