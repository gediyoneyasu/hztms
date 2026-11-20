const Booking = require('../models/Booking');
const { generateCode } = require('../utils/generateCode');
const createBooking = async (req, res) => {
  try {
    const { scheduleId, passengerName, phone, seats } = req.body;
    if (!scheduleId || !passengerName || !phone) return res.status(400).json({ message: 'Missing fields' });
    const ticketCode = generateCode();
    const booking = await Booking.create({ ticketCode, scheduleId, passengerName, phone, seats: seats || 1 });
    res.status(201).json(booking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const getBookings = async (req, res) => {
  try { res.json(await Booking.find().populate('scheduleId')); } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    booking.status = req.body.status;
    res.json(await booking.save());
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { createBooking, getBookings, updateBookingStatus };
