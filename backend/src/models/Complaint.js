const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true }, // Generated ID
  bookingId: { type: String, required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  travelDate: { type: String },
  busPlate: { type: String },
  imageUrl: { type: String },
  contactPhone: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending' },
  adminResponse: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
