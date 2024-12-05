// models/mesa.js
const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true
    },
    ability: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true, required: true
    },
    area: {
        type: String,
        required: true
    }
});

const Mesa = mongoose.model('Table', mesaSchema);

module.exports = Mesa;
