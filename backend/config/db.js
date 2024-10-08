const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definido en las variables de entorno');
    }

    console.log('Intentando conectarse a MongoDB...');
    console.log('MONGO_URI:', process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4 
    });

    console.log('Base de datos conectada exitosamente');
  } catch (err) {
    console.error('Error de conexión a la base de datos:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.reason) console.error('Error reason:', err.reason);
    process.exit(1);
  }
};

module.exports = connectDB;