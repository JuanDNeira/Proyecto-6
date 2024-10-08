import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ProductCatalog from './client/ProductCatalog';
import ShoppingCart from './client/ShoppingCart';
import Checkout from './client/Checkout';
import OrderHistory from './client/OrderHistory';
import { CartProvider } from './client/CartContext';

const Navigation = () => (
  <nav>
    <ul>
      <li><Link to="catalog">Catálogo</Link></li>
      <li><Link to="cart">Carrito</Link></li>
      <li><Link to="checkout">Compra</Link></li>
      <li><Link to="orders">Mis Pedidos</Link></li>
    </ul>
  </nav>
);

function ClientDashboard() {
  return (
    <div>
      <Navigation />
      <CartProvider>
        <Routes>
          <Route path="catalog" element={<ProductCatalog />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="orders" element={<OrderHistory />} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default ClientDashboard;
