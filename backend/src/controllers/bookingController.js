const Booking = require('../models/Booking');
const { generateCode } = require('../utils/generateCode');

const createBooking = async (req, res) => {
  try {
    const { scheduleId, passengerName, phone, seats, userEmail } = req.body;
    if (!scheduleId || !passengerName || !phone) return res.status(400).json({ message: 'Missing fields' });
    const ticketCode = generateCode();
    const booking = await Booking.create({ ticketCode, scheduleId, passengerName, phone, userEmail, seats: seats || 1 });
    res.status(201).json(booking);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getBookings = async (req, res) => {
  try { res.json(await Booking.find().populate('scheduleId')); } catch (error) { res.status(500).json({ message: error.message }); }
};

const getMyBookings = async (req, res) => {
  try { 
    const bookings = await Booking.find({ userEmail: req.params.email }).populate('scheduleId'); 
    res.json(bookings);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    booking.status = req.body.status;
    res.json(await booking.save());
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const verifyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code }).populate('scheduleId');
    if (!booking) {
      return res.status(404).json({ message: 'Ticket not found. Please check the code.' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getBookings, getMyBookings, updateBookingStatus, verifyBooking };
