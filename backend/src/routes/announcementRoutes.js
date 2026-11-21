const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { admin, protect } = require('../middleware/authMiddleware');
router.route('/').get(getAnnouncements).post(protect, admin, createAnnouncement);
router.route('/:id').delete(protect, admin, deleteAnnouncement);
module.exports = router;
