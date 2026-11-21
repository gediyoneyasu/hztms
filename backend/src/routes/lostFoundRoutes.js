const express = require('express');
const router = express.Router();
const { createLostItem, getLostItems, createFoundItem, getFoundItems, getAdminFoundItems, updateFoundItemStatus } = require('../controllers/lostFoundController');

router.route('/lost').post(createLostItem).get(getLostItems);
router.route('/found').post(createFoundItem).get(getFoundItems);
router.route('/admin/found').get(getAdminFoundItems);
router.route('/admin/found/:id').put(updateFoundItemStatus);

module.exports = router;
