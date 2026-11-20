const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true, default: 'Hossana' },
  from_am: { type: String, default: 'ሆሳና' },
  to: { type: String, required: true },
  to_am: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  frequency: { type: String, required: true },
  frequency_am: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
