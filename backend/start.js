require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const analyticsRoutes = require('./routes/analyticsRoutes');
const emailRoutes = require('./routes/emailRoutes');


// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'https://proyecto-6-alpha.vercel.app',
    'https://proyecto-6-q1yv01kwd-juandneiras-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes')); 
app.use('/api', analyticsRoutes);
app.use('/api', emailRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Escuchar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
