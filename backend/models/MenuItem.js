const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, require: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
  image: { type: String} // Solo URL
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);