const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
    },
    ability: {
        type: Number,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone', // Relación con zonas
        required: true,
    },
});

const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);
module.exports = Table;