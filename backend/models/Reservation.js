// models/reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    numberOfPeople: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',  // Referencia al modelo Zone
        required: true
    },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },

    name: { type: String, required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
