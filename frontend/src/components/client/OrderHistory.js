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
      const response = await axios.get('/orders');
      // Ordenar los pedidos por fecha y añadir un número secuencial
      const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const ordersWithSequence = sortedOrders.map((order, index) => ({
        ...order,
        sequenceNumber: sortedOrders.length - index
      }));
      setOrders(ordersWithSequence);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      toast.error('Error al obtener los pedidos');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No tienes pedidos anteriores.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">Pedido #{order.sequenceNumber}</h3>
              <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Estado: {order.status}</p>
              <p className="font-bold">Total: ${(order.total / 100).toFixed(2)}</p>
              <h4 className="mt-2 font-semibold">Productos:</h4>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.productName || 'Producto desconocido'} - Cantidad: {item.quantity}
                  </li>
                ))}
              </ul>
              <p>Dirección de envío: {order.shippingAddress}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;