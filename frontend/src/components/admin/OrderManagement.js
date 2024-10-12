import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import '../../tailwind.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const response = await axios.put(`/orders/${orderId}`, { status: newStatus });
      if (response.data) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success('Estado del pedido actualizado correctamente');
      } else {
        throw new Error('La respuesta del servidor no incluye la orden actualizada');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del pedido', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Gestión de Pedidos</h2>
      <div className="mb-4 flex justify-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">ID de Pedido</th>
            <th className="px-4 py-2 border">Cliente</th>
            <th className="px-4 py-2 border">Fecha</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{order._id}</td>
              <td className="px-4 py-2 border">{order.customer?.name || 'N/A'}</td>
              <td className="px-4 py-2 border">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">${order.total.toFixed(2)}</td>
              <td className="px-4 py-2 border">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Enviado">Enviado</option>
                </select>
              </td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded hover:bg-gradient-to-l transition duration-300"
                  onClick={() => handleViewDetails(order)}
                >
                  Ver Detalles
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Detalles del Pedido</h3>
            <p><strong>ID de Pedido:</strong> {selectedOrder._id}</p>
            <p><strong>Cliente:</strong> {selectedOrder.customer?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
            <p><strong>Dirección de Envío:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
            <h4 className="mt-4 font-semibold">Productos:</h4>
            <ul className="list-disc ml-6">
              {selectedOrder.items?.map((item, index) => (
                <li key={index} className="mb-1">
                  {item.name || 'Producto desconocido'} - Cantidad: {item.quantity} - Precio: ${(item.price || 0).toFixed(2)}
                </li>
              )) || <li>No hay productos disponibles</li>}
            </ul>
            <p className="font-semibold"><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
