const express = require('express');
const router = express.Router();
const { getAllDestinations, getDestinationBudget } = require('../controllers/destinationController');

// @route   GET /api/destinations
router.get('/', getAllDestinations);

// @route   GET /api/budget/:destination
router.get('/budget/:destination', getDestinationBudget);

module.exports = router;
