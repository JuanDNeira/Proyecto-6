import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      toast.error('Error al obtener los pedidos');
    }
  };

  return (
    <div>
      <h2>Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos anteriores.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Pedido #{order._id}</h3>
              <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Estado: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <h4>Productos:</h4>
              <ul>
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.product.name} - Cantidad: {item.quantity} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;