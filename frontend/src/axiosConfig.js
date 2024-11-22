import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://backend-l3gq.onrender.com';

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a las solicitudes
instance.interceptors.request.use(config => {
  config.url = `/api${config.url}`;
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log para debugging
  console.log('Request URL:', config.baseURL + config.url);
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar respuestas y errores
instance.interceptors.response.use(
  response => {
    return response;
  }, 
  error => {
    if (error.response) {
      // Error de respuesta del servidor
      console.error('Error del servidor:', error.response.data);
      
      // Manejar diferentes códigos de estado
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token');
          // Aquí podrías redirigir al login
          break;
        case 403:
          console.error('Acceso prohibido');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error no manejado');
      }
    } else if (error.request) {
      // Error de red o servidor no disponible
      console.error('Error de red:', error.request);
    } else {
      // Error en la configuración de la solicitud
      console.error('Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
