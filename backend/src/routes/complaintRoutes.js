const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getMyComplaints, updateComplaint } = require('../controllers/complaintController');
const { admin, protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComplaint).get(protect, admin, getComplaints);
router.route('/my/:email').get(protect, getMyComplaints);
router.route('/:id').put(protect, admin, updateComplaint);

module.exports = router;
