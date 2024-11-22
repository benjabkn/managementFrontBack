// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);
// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);
// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);
// Ruta para actualizar un usuario por ID
router.put('/:id', userController.updateUser);
// Ruta para eliminar un usuario por ID
router.delete('/:id', userController.deleteUser);




// Ruta para autenticar al usuario
router.post('/login', userController.authenticateUser);
module.exports = router;
