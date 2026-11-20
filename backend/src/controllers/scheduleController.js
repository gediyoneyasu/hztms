const Schedule = require('../models/Schedule');
const getSchedules = async (req, res) => { try { res.json(await Schedule.find()); } catch (e) { res.status(500).json({message: e.message}); } };
const createSchedule = async (req, res) => { try { res.status(201).json(await Schedule.create(req.body)); } catch (e) { res.status(500).json({message: e.message}); } };
const deleteSchedule = async (req, res) => { try { await Schedule.findByIdAndDelete(req.params.id); res.json({message: 'Deleted'}); } catch (e) { res.status(500).json({message: e.message}); } };
const updateScheduleStatus = async (req, res) => {
  try {
    const s = await Schedule.findById(req.params.id);
    s.status = req.body.status;
    res.json(await s.save());
  } catch (e) { res.status(500).json({message: e.message}); }
};
module.exports = { getSchedules, createSchedule, deleteSchedule, updateScheduleStatus };
