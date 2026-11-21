const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getMyComplaints, updateComplaint } = require('../controllers/complaintController');

router.route('/').post(createComplaint).get(getComplaints);
router.route('/my/:email').get(getMyComplaints);
router.route('/:id').put(updateComplaint);

module.exports = router;
