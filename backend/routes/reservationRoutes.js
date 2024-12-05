const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Route to create a new reservation
router.post('/reservation', reservationController.createReservation);
router.get('/reservation', reservationController.getReservations);
router.delete('/reservation/:reservationId', reservationController.deleteReservation);
router.put('/reservation/:reservationId', reservationController.updateReservation);

module.exports = router;
