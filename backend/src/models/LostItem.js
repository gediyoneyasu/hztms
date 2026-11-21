const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  bookingId: { type: String, required: true }, // The Ticket Code
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  lostDate: { type: String, required: true },
  lostLocation: { type: String, required: true },
  busPlate: { type: String },
  imageUrl: { type: String },
  contactPhone: { type: String, required: true },
  userEmail: { type: String, required: true }, // To link to the logged-in user
  status: { type: String, enum: ['Reported', 'Under Review', 'Found', 'Returned', 'Rejected'], default: 'Reported' }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
