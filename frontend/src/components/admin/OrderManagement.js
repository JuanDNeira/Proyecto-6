import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      toast.error('Error al obtener los pedidos');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Estado del pedido actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el estado del pedido', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <div>
      <h2>Gestión de Pedidos</h2>
      <div>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">En proceso</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID de Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customer.name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">En proceso</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleViewDetails(order)}>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedOrder && (
        <div>
          <h3>Detalles del Pedido</h3>
          <p>ID de Pedido: {selectedOrder._id}</p>
          <p>Cliente: {selectedOrder.customer.name}</p>
          <p>Email: {selectedOrder.customer.email}</p>
          <p>Dirección de Envío: {selectedOrder.shippingAddress}</p>
          <h4>Productos:</h4>
          <ul>
            {selectedOrder.items.map((item) => (
              <li key={item._id}>
                {item.product.name} - Cantidad: {item.quantity} - Precio: ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${selectedOrder.total.toFixed(2)}</p>
          <button onClick={() => setSelectedOrder(null)}>Cerrar Detalles</button>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;