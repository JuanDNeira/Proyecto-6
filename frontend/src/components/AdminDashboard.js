import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import InventoryManagement from './admin/InventoryManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import Analytics from './admin/Analytics';

function AdminDashboard() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="inventory">Gestión de Inventario</Link></li>
          <li><Link to="users">Gestión de Usuarios</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
