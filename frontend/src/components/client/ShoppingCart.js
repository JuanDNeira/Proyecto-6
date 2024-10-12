import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

function ShoppingCart() {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    navigate('/client-dashboard/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <ShoppingBag className="mr-2" size={32} />
        Carrito de Compras
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-lg">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.product._id} className="py-6 flex items-center">
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      updateQuantity(item.product._id, parseInt(e.target.value) || 1);
                      toast.success('Cantidad actualizada');
                    }}
                    className="mx-2 w-16 text-center border rounded-md"
                  />
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => {
                      removeItem(item.product._id);
                      toast.error('Producto eliminado');
                    }}
                    className="ml-4 text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t pt-8">
            <div className="flex justify-between text-2xl font-bold text-gray-900">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-lg font-medium"
            >
              <CreditCard className="mr-2" size={24} />
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;