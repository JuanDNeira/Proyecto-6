import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Package, Calendar, MapPin, DollarSign, User, Mail } from 'lucide-react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders');
      const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const ordersWithSequence = sortedOrders.map((order, index) => ({
        ...order,
        sequenceNumber: sortedOrders.length - index
      }));
      setOrders(ordersWithSequence);
    } catch (error) {
      console.error('Error al obtener los pedidos', error);
      toast.error('Error al obtener los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};


  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <Package className="mr-2" size={32} />
        Historial de Pedidos
      </h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No tienes pedidos anteriores.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order._id} className="bg-white border rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Pedido #{order.sequenceNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status || 'Desconocido'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={20} />
                    <span>Fecha: {new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="mr-2" size={20} />
                    <span className="font-medium">Total: ${calculateTotal(order.items).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-gray-600">
                  <User className="mr-2" size={20} />
                  <span>Cliente: {order.customer?.name || 'N/A'}</span>
                </div>
                <div className="mt-2 flex items-center text-gray-600">
                  <Mail className="mr-2" size={20} />
                  <span>Email: {order.customer?.email || 'N/A'}</span>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Productos:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {order.items && order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>
                          {item.name || item.product?.name || 'Producto desconocido'} - Cantidad: {item.quantity || 0}
                        </span>
                        <span className="font-medium">
                          ${item.price.toFixed(2)} c/u = Total: ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex items-start text-gray-600">
                  <MapPin className="mr-2 mt-1 flex-shrink-0" size={20} />
                  <span>Dirección de envío: {order.shippingAddress || 'No especificada'}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;


