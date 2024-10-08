import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';

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
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product._id}>
                {item.product.name} - ${item.product.price}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    updateQuantity(item.product._id, parseInt(e.target.value) || 1);
                    toast.success('Cantidad actualizada');
                  }}
                />
                <button onClick={() => {
                  removeItem(item.product._id);
                  toast.error('Producto eliminado');
                }}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${calculateTotal().toFixed(2)}</p>
          <button onClick={handleCheckout}>Proceder al Pago</button>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;