import axios from 'axios';

// Determinar la URL base según el entorno
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Opcional: timeout para las peticiones
  timeout: 10000,
  // Opcional: si necesitas enviar cookies
  withCredentials: true
});

// Interceptor para agregar el token a las solicitudes
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debugging (puedes removerlo en producción)
    console.log('Request:', config.baseURL + config.url);
    
    return config;
  }, 
  error => {
    console.error('Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

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
