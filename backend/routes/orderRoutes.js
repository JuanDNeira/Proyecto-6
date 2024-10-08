const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Crear un nuevo pedido
router.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;

    // Crear un nuevo pedido
    const newOrder = new Order({
      items,
      shippingAddress,
      total
    });

    // Guardar el pedido en la base de datos
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
});

// Obtener el historial de pedidos de un usuario (puedes ajustar esto para que obtenga por usuario autenticado)
router.get('/api/orders/my-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
});

module.exports = router;
