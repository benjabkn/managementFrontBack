// models/Zone.js
const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true  // Asegurarse de que cada zona tiene un nombre único
    },
    description: {
        type: String,
        required: false
    },
    capacity: {
        type: Number,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true  // Para activar/desactivar zonas
    }
}, { timestamps: true });

const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
