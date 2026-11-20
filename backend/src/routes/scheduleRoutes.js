const express = require('express');
const router = express.Router();
const { getSchedules, createSchedule, deleteSchedule, updateScheduleStatus } = require('../controllers/scheduleController');
router.route('/').get(getSchedules).post(createSchedule);
router.route('/:id').delete(deleteSchedule).put(updateScheduleStatus);
module.exports = router;
