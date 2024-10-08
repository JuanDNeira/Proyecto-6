const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token recibido:', token);
    if (!token) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    const user = await User.findById(decoded.user.id).select('-password');
    console.log('Usuario encontrado:', user);

    if (!user) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error en authMiddleware:', err.message);
    res.status(401).json({ message: 'Token no válido' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo para administradores.' });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };