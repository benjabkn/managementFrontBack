const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, require: true},
  category: { type: String, require: true},
  image: { type: String, required: true }, // Solo URL
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);