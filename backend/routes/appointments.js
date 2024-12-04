// routes/appointments.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Crear una cita
router.post('/appointments', appointmentController.createAppointment);

// Obtener las citas de un usuario
router.get('/appointments/:userId', appointmentController.getAppointments);

router.get('/appointments', appointmentController.getAllAppointments);


// Actualizar una cita
router.put('/appointments/:id', appointmentController.updateAppointment);

// Eliminar una cita
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;
