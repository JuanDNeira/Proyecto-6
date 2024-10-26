import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a las solicitudes
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Manejo de errores de solicitud
  return Promise.reject(error);
});

// Interceptor para manejar errores globalmente
instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response) {
    console.error('Error en la respuesta:', error.response.data);
  }
  return Promise.reject(error);
});

export default instance;
