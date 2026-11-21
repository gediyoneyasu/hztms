const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  ticketCode: { type: String, required: true, unique: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  passengerName: { type: String, required: true },
  phone: { type: String, required: true },
  userEmail: { type: String, default: 'guest@example.com' }, // Fixed: Now optional with default
  seats: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
