require('dotenv').config();
require('./config/passport');  // Asegúrate de cargar la configuración de Passport

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const axios = require('axios');
const menuRoutes = require('./routes/menuRoutes'); // Rutas para el menú
const userRoutes = require('./routes/userRoutes'); // Ajusta la ruta según tu estructura
const categoryRoutes = require('./routes/categoryRoutes');
const loginRoutes = require('./routes/loginRoutes');  // Asegúrate de tener rutas de login
const path = require('path');
const cors = require('cors');
const app = express();
const passport = require('passport');
const jwtAuth = require('./middleware/jwtAuth');
const authRoutes = require('./routes/loginRoutes');
const appointmentRoutes = require('./routes/appointments');
const reservationRoutes = require('./routes/reservationRoutes');
const tableRoutes = require('./routes/tablesRoutes');
const zoneRoutes = require('./routes/zonesRoutes');
// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Inicializar Passport
app.use(passport.initialize());



// Rutas
app.use('/api/menu', menuRoutes); // Monta las rutas de menú en "/api/menu"
app.use('/api/menu/a', menuRoutes); // Monta las rutas de menú en "/api/menu"
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', reservationRoutes);
app.use('/api', tableRoutes);
app.use('/api', zoneRoutes);


// Configurar el puerto y la URI de MongoDB desde el archivo .env
const PORT = process.env.PORT;
const mongoUri = process.env.MONGODB_URI;




// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: err.message });
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});



// Inicia el servidor
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});



// Conexión a MongoDB
mongoose.connect(mongoUri, {
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
