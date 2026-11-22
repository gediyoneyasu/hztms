const express = require('express');
const router = express.Router();
const { createLostItem, getLostItems, createFoundItem, getFoundItems, getAdminFoundItems, updateFoundItemStatus } = require('../controllers/lostFoundController');
const { admin, protect } = require('../middleware/authMiddleware');

// Removed 'protect' from the POST route so guests can report lost items
router.route('/lost').post(createLostItem).get(protect, admin, getLostItems);
router.route('/found').post(createFoundItem).get(getFoundItems);
router.route('/admin/found').get(protect, admin, getAdminFoundItems);
router.route('/admin/found/:id').put(protect, admin, updateFoundItemStatus);

router.route('/admin/lost/:id').put(protect, admin, (req, res) => {
  const LostItem = require('../models/LostItem');
  LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(item => res.json(item)).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
