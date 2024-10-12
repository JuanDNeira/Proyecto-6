import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Login from './components/Login';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import SimpleProductList from './components/SimpleProductList';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/clientDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';
import './tailwind.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-product" element={<PrivateRoute element={<ProductForm />} allowedRoles={['admin']} />} />
            <Route path="/product" element={<SimpleProductList />} />
            <Route path="/products" element={<PrivateRoute element={<ProductList />} allowedRoles={['admin', 'client']} />} />
            <Route path="/admin-dashboard/*" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
            <Route path="/client-dashboard/*" element={<PrivateRoute element={<ClientDashboard />} allowedRoles={['client']} />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;