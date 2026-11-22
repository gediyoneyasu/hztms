const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getMyBookings, updateBookingStatus, verifyBooking } = require('../controllers/bookingController');
const { admin, protect } = require('../middleware/authMiddleware');

router.route('/').post(createBooking).get(protect, admin, getBookings);
router.route('/my/:email').get(getMyBookings); 
router.route('/verify/:code').get(verifyBooking); 
router.route('/:id').put(protect, admin, updateBookingStatus);

module.exports = router;
