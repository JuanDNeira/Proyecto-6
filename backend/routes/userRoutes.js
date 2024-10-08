const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client' 
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


// Nueva ruta para obtener todos los usuarios (solo para administradores)
router.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor al obtener usuarios');
  }
});
router.put('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    // Verificar si el usuario existe
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar la información del usuario
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    // Si se proporciona una nueva contraseña, hasheala
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    // Guardar el usuario actualizado
    await user.save();

    // Devolver el usuario actualizado sin la contraseña
    const updatedUser = await User.findById(userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor al actualizar usuario');
  }
});

// Ruta para eliminar un usuario (solo para administradores)
router.delete('/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // ruta para eliminar el usuario directamente
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor al eliminar usuario');
  }
});


module.exports = router;
