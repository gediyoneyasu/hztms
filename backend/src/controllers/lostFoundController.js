const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Booking = require('../models/Booking');

const createLostItem = async (req, res) => {
  try {
    let { bookingId, userEmail } = req.body;
    
    if (!bookingId || bookingId === 'ADMIN-OFFICE' || bookingId === 'ADMIN-ADDED') {
      bookingId = 'ADMIN-ADDED';
    } else {
      const booking = await Booking.findOne({ ticketCode: bookingId });
      if (!booking) return res.status(404).json({ message: 'Invalid Ticket ID. No booking found.' });
    }
    
    const item = await LostItem.create({ ...req.body, bookingId });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getLostItems = async (req, res) => {
  try { res.json(await LostItem.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

const createFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.create({ ...req.body, isPublished: false });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getFoundItems = async (req, res) => {
  try { 
    const foundItems = await FoundItem.find({ isPublished: true });
    const lostItemsFound = await LostItem.find({ status: 'Found' });
    
    const combined = [...foundItems, ...lostItemsFound].sort((a, b) => b.createdAt - a.createdAt);
    res.json(combined); 
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAdminFoundItems = async (req, res) => {
  try { res.json(await FoundItem.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateFoundItemStatus = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createLostItem, getLostItems, createFoundItem, getFoundItems, getAdminFoundItems, updateFoundItemStatus };
