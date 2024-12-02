const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');

// Ruta para hacer login
router.post('/login', LoginController.login);

// Ruta para logout (si decides usar alguna lógica de frontend para eliminar el token)
router.get('/logout', LoginController.logout);

module.exports = router;
