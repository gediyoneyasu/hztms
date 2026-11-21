const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { admin, protect } = require('../middleware/authMiddleware');
router.route('/').post(createBooking).get(protect, admin, getBookings);
router.route('/:id').put(protect, admin, updateBookingStatus);
module.exports = router;
