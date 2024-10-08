import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const order = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress,
        total: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
      };

      await axios.post('/orders', order);
      localStorage.removeItem('cart');
      toast.success('Pedido realizado con éxito');
      navigate('/client-dashboard/orders');
    } catch (error) {
      console.error('Error al realizar el pedido', error);
      toast.error('Error al realizar el pedido');
    }
  };

  return (
    <div>
      <h2>Finalizar Compra</h2>
      <form onSubmit={handleSubmit}>
        <h3>Resumen del Pedido</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.product._id}>
              {item.product.name} - Cantidad: {item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Total: ${cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</p>
        
        <h3>Dirección de Envío</h3>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          required
        />
        
        <button type="submit">Realizar Pedido</button>
      </form>
    </div>
  );
}

export default Checkout;