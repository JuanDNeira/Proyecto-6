import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import ProductCatalog from './client/ProductCatalog';
import ShoppingCart from './client/ShoppingCart';
import Checkout from './client/Checkout';
import OrderHistory from './client/OrderHistory';
import { CartProvider } from './client/CartContext';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  return (
    <aside className="w-64 bg-indigo-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Cliente Dashboard</h1>
      </div>
      <nav className="mt-8">
        <ul>
          {[
            { path: "catalog", name: "Catálogo" },
            { path: "cart", name: "Carrito" },
            { path: "checkout", name: "Compra" },
            { path: "orders", name: "Mis Pedidos" },
          ].map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`block py-2 px-4 text-sm font-medium transition duration-150 ease-in-out rounded-md ${
                  isActive(item.path)
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

function ClientDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation />
      <CartProvider>
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="catalog" element={<ProductCatalog />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<OrderHistory />} />
            </Routes>
          </div>
        </main>
      </CartProvider>
    </div>
  );
}

export default ClientDashboard;
