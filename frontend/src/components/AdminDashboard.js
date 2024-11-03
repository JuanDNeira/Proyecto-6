import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import InventoryManagement from './admin/InventoryManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';
import EmailForm from './admin/EmailForm';

function AdminDashboard() {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-60 bg-indigo-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
        <nav className="mt-8">
          <ul>
            {[
              { path: "inventory", name: "Gestión de Inventario" },
              { path: "orders", name: "Gestión de Pedidos" },
              { path: "users", name: "Gestión de Usuarios" },
              { path: "email", name: "Gestión de Correos" },
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
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="email" element={<EmailForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
