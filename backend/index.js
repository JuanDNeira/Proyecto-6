const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Endpoint de prueba
let items = [];

// Obtener todos los items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Agregar un nuevo item
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
