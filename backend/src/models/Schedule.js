const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Boarding', 'Available', 'Full'], default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
