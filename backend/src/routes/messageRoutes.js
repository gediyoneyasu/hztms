const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/messageController');
const { admin, protect } = require('../middleware/authMiddleware');
router.route('/').get(protect, admin, getMessages).post(createMessage);
module.exports = router;
