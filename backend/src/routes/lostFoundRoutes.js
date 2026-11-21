const express = require('express');
const router = express.Router();
const { createLostItem, getLostItems, createFoundItem, getFoundItems, getAdminFoundItems, updateFoundItemStatus } = require('../controllers/lostFoundController');

router.route('/lost').post(createLostItem).get(getLostItems);
router.route('/found').post(createFoundItem).get(getFoundItems);
router.route('/admin/found').get(getAdminFoundItems);
router.route('/admin/found/:id').put(updateFoundItemStatus);
router.route('/admin/lost/:id').put((req, res) => {
  const LostItem = require('../models/LostItem');
  LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(item => res.json(item)).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;

