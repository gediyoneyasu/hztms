const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String },
  title_en: { type: String },
  title_am: { type: String },
  date: { type: String, required: true },
  body: { type: String },
  body_en: { type: String },
  body_am: { type: String },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
