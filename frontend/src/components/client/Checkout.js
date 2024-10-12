import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingBag, MapPin, CreditCard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

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
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress,
        total: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
      };

      // Asegúrate de que el token se envía en el encabezado
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.post('/orders', order, config);
      localStorage.removeItem('cart');
      toast.success('Pedido realizado con éxito');
      navigate('/client-dashboard/orders');
    } catch (error) {
      console.error('Error al realizar el pedido', error);
      toast.error('Error al realizar el pedido');
    }
  };

  const total = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Finalizar Compra</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <ShoppingBag className="mr-2" size={24} />
            Resumen del Pedido
          </h3>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.product._id} className="py-4 flex justify-between">
                <span className="text-gray-600">{item.product.name} - Cantidad: {item.quantity}</span>
                <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xl font-bold text-gray-800 flex justify-between">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <User className="mr-2" size={24} />
            Información del Cliente
          </h3>
          {user ? (
            <>
              <p className="text-gray-600">Nombre: {user.name}</p>
              <p className="text-gray-600">Email: {user.email}</p>
            </>
          ) : (
            <p className="text-gray-600">Cargando información del usuario...</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <MapPin className="mr-2" size={24} />
            Dirección de Envío
          </h3>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            rows="4"
            placeholder="Ingrese su dirección de envío"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
        >
          <CreditCard className="mr-2" size={20} />
          Realizar Pedido
        </button>
      </form>
    </div>
  );
}

export default Checkout;