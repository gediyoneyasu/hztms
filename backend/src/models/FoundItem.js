const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  foundDate: { type: String, required: true },
  foundLocation: { type: String, required: true },
  busPlate: { type: String },
  foundBy: { type: String, required: true },
  contactPhone: { type: String, required: true },
  imageUrl: { type: String },
  isPublished: { type: Boolean, default: false }, // Admin must publish
  status: { type: String, enum: ['Reported', 'Published', 'Claim Pending', 'Returned', 'Rejected', 'Unclaimed'], default: 'Reported' }
}, { timestamps: true });

module.exports = mongoose.model('FoundItem', foundItemSchema);
