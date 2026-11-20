const express = require('express');
const router = express.Router();
const { getRoutes, createRoute, deleteRoute } = require('../controllers/routeController');
router.route('/').get(getRoutes).post(createRoute);
router.route('/:id').delete(deleteRoute);
module.exports = router;
