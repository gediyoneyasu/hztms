const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true, default: 'Hossana' },
  to: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  frequency: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
