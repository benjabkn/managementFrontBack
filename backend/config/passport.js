// /config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Asegúrate de tener un modelo de usuario

// Estrategia local para el login
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      // Buscar el usuario en la base de datos
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      // Comparar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Generar un JWT después de la autenticación local
passport.generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
};
