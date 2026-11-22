const Complaint = require('../models/Complaint');
const Booking = require('../models/Booking');

const generateComplaintId = () => 'CMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();

const createComplaint = async (req, res) => {
  try {
    const { bookingId, userEmail } = req.body;
    
    // Check if the ticket exists, but DO NOT block if emails don't match
    const booking = await Booking.findOne({ ticketCode: bookingId });
    if (!booking) return res.status(404).json({ message: 'Invalid Ticket ID. No booking found.' });
    
    const complaintId = generateComplaintId();
    
    // If no email is provided, use the booking's email or a default
    const finalEmail = userEmail || booking.userEmail || 'guest@example.com';

    const complaint = await Complaint.create({ ...req.body, userEmail: finalEmail, complaintId });
    res.status(201).json(complaint);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

const getComplaints = async (req, res) => {
  try { res.json(await Complaint.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyComplaints = async (req, res) => {
  try { res.json(await Complaint.find({ userEmail: req.params.email }).sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateComplaint = async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createComplaint, getComplaints, getMyComplaints, updateComplaint };
