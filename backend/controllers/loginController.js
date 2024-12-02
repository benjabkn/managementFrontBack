const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Asegúrate de que el modelo de Usuario esté correctamente importado

// Endpoint para el login: validar las credenciales y generar el token JWT
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
  
    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si la contraseña es válida
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },  // Los datos que quieres incluir en el token
        'your_jwt_secret',  // Asegúrate de usar una clave secreta segura
        { expiresIn: '1h' }  // El token expira en 1 hora
      );
  
      // Devolver el token JWT y los datos del usuario
      res.status(200).json({
        message: 'Autenticación exitosa',
        token: token,  // Enviar el token al cliente
        user: { id: user._id, name: user.name, email: user.email }  // Datos del usuario
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

// Logout (cerrar sesión) - El token ya no se usa en el backend, pero puedes manejar el lado del cliente
exports.logout = (req, res) => {
  res.json({ message: 'Sesión cerrada' });
};
