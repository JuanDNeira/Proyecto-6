const express = require('express');
const Order = require('../models/Order');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');


// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  }
});


// Crear un nuevo pedido
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    const { items, shippingAddress, total } = req.body;
    
    // Usa la información del usuario autenticado
    const customer = {
      name: req.user.name,
      email: req.user.email
    };

    console.log('Extracted items:', JSON.stringify(items, null, 2));
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'La orden debe contener items válidos' });
    }

    const validItems = items.every(item => {
      const isValid = item.product && item.name && item.quantity && item.price;
      console.log(`Item validation: ${JSON.stringify(item)} - isValid: ${isValid}`);
      return isValid;
    });

    if (!validItems) {
      return res.status(400).json({ message: 'Todos los items deben tener product, name, quantity y price' });
    }

    const newOrder = new Order({
      items,
      shippingAddress,
      total,
      customer,
      userId: req.user._id // Asocia el pedido con el usuario autenticado
    });

    console.log('New order object before save:', JSON.stringify(newOrder, null, 2));

    const savedOrder = await newOrder.save();
    console.log('Saved order:', JSON.stringify(savedOrder, null, 2));

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
  }
});

// Actualizar el estado de un pedido
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el pedido' });
  }
});

module.exports = router;
