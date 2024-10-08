import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/login', { email, password });
      console.log('Respuesta del servidor:', response.data); 
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user && response.data.user.role) {
          localStorage.setItem('userRole', response.data.user.role);
          toast.success('Inicio de sesión exitoso');
          if (response.data.user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/client-dashboard');
          }
        } else {
          toast.error('Error: Información de usuario incompleta');
        }
      } else {
        toast.error('Error: Token no recibido');
      }
    } catch (error) {
      console.error('Error de inicio de sesión', error);
      toast.error('Error de inicio de sesión: ' + (error.response?.data?.message || 'Intente de nuevo'));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;