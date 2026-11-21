const express = require('express');
const upload = require('../middleware/upload');
const { uploadImage } = require('../config/cloudinary');

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose an image file' });
    const image = await uploadImage(req.file);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
