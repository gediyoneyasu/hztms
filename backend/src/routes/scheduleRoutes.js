const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, deleteSchedule, updateScheduleStatus } = require('../controllers/scheduleController');
const { admin, protect } = require('../middleware/authMiddleware');
router.route('/').get(getSchedules).post(protect, admin, createSchedule);
router.route('/:id').delete(protect, admin, deleteSchedule).put(protect, admin, updateScheduleStatus);
module.exports = router;
