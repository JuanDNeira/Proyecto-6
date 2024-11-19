import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Download, Loader } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import '../../tailwind.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

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

  const handleExportPDF = async () => {
    if (selectedOrderIds.length === 0) {
      toast.warning('Por favor, selecciona al menos un pedido para exportar');
      return;
    }

    try {
      setLoading(true);
      
      const selectedOrders = orders.filter(order => selectedOrderIds.includes(order._id));

      const colors = {
        primary: '#4F46E5',   
        secondary: '#6366F1',  
        text: '#1F2937',      
        lightBg: '#F3F4F6',   
        border: '#E5E7EB',    
        success: '#4F46E5'     
      };

      const content = `
        <div style="padding: 20px; font-family: Arial, sans-serif; color: ${colors.text};">
          <div style="background-color: ${colors.primary}; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="text-align: center; color: white; margin: 0; font-size: 24px;">Reporte de Pedidos</h1>
            <p style="text-align: center; color: white; margin: 10px 0 0 0;">
              Generado el ${new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          ${selectedOrders.map(order => `
            <div style="
              border: 1px solid ${colors.border}; 
              padding: 20px; 
              margin-bottom: 30px; 
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
            >
              <div style="
                background-color: ${colors.lightBg};
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;"
              >
                <h2 style="
                  color: ${colors.primary};
                  margin: 0 0 15px 0;
                  font-size: 18px;
                  border-bottom: 2px solid ${colors.primary};
                  padding-bottom: 10px;"
                >
                  Pedido ID: ${order._id}
                </h2>
                
                <div style="
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                  font-size: 14px;"
                >
                  <div>
                    <p style="margin: 5px 0;">
                      <strong style="color: ${colors.secondary};">Cliente:</strong> 
                      ${order.customer?.name || 'N/A'}
                    </p>
                    <p style="margin: 5px 0;">
                      <strong style="color: ${colors.secondary};">Email:</strong> 
                      ${order.customer?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style="margin: 5px 0;">
                      <strong style="color: ${colors.secondary};">Fecha:</strong> 
                      ${new Date(order.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <p style="margin: 10px 0;">
                  <strong style="color: ${colors.secondary};">Dirección:</strong><br>
                  ${order.shippingAddress || 'N/A'}
                </p>
              </div>
              
              <table style="
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                font-size: 14px;"
              >
                <thead>
                  <tr style="background-color: ${colors.primary}; color: white;">
                    <th style="padding: 12px; text-align: left; border-radius: 8px 0 0 0;">Producto</th>
                    <th style="padding: 12px; text-align: center;">Cantidad</th>
                    <th style="padding: 12px; text-align: right; border-radius: 0 8px 0 0;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items?.map((item, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? 'white' : colors.lightBg};">
                      <td style="padding: 12px; border-bottom: 1px solid ${colors.border};">
                        ${item.name || 'Producto desconocido'}
                      </td>
                      <td style="padding: 12px; text-align: center; border-bottom: 1px solid ${colors.border};">
                        ${item.quantity}
                      </td>
                      <td style="padding: 12px; text-align: right; border-bottom: 1px solid ${colors.border};">
                        $${(item.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  `).join('') || `
                    <tr>
                      <td colspan="3" style="
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-style: italic;"
                      >
                        No hay productos disponibles
                      </td>
                    </tr>
                  `}
                </tbody>
                <tfoot>
                  <tr style="background-color: ${colors.success}; color: white;">
                    <td colspan="2" style="
                      padding: 12px;
                      text-align: right;
                      font-weight: bold;
                      border-radius: 0 0 0 8px;"
                    >
                      Total:
                    </td>
                    <td style="
                      padding: 12px;
                      text-align: right;
                      font-weight: bold;
                      border-radius: 0 0 8px 0;"
                    >
                      $${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          `).join('')}
        </div>
      `;

      const opt = {
        margin: [15, 15, 15, 15],
        filename: `pedidos_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      const element = document.createElement('div');
      element.innerHTML = content;
      
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          toast.success('PDF generado exitosamente');
        })
        .catch((error) => {
          console.error('Error al generar el PDF:', error);
          toast.error('Error al generar el PDF');
        });

    } catch (error) {
      console.error('Error al exportar pedidos:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Gestión de Pedidos</h2>
      
      <div className="mb-4 flex justify-between items-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviado">Enviado</option>
        </select>

        <button
          onClick={handleExportPDF}
          disabled={loading || !selectedOrderIds.length}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          {loading ? 'Generando PDF...' : `Exportar ${selectedOrderIds.length} pedido(s) a PDF`}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrderIds(filteredOrders.map(order => order._id));
                    } else {
                      setSelectedOrderIds([]);
                    }
                  }}
                  checked={selectedOrderIds.length === filteredOrders.length}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
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
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(order._id)}
                    onChange={() => toggleOrderSelection(order._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
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
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-4">Detalles del Pedido</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="mb-2"><strong>ID de Pedido:</strong> {selectedOrder._id}</p>
                <p className="mb-2"><strong>Cliente:</strong> {selectedOrder.customer?.name || 'N/A'}</p>
                <p className="mb-2"><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="mb-2"><strong>Fecha:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p className="mb-2"><strong>Estado:</strong> {selectedOrder.status}</p>
                <p className="mb-2"><strong>Dirección de Envío:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <h4 className="bg-gray-100 p-3 font-semibold">Productos:</h4>
              <div className="p-3">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left">Producto</th>
                      <th className="px-3 py-2 text-right">Cantidad</th>
                      <th className="px-3 py-2 text-right">Precio Unit.</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2">{item.name || 'Producto desconocido'}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">${(item.price || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${((item.price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    )) || <tr><td colSpan="4" className="text-center py-2">No hay productos disponibles</td></tr>}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan="3" className="px-3 py-2 text-right font-bold">Total:</td>
                      <td className="px-3 py-2 text-right font-bold">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;