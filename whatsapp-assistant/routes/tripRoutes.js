const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const subscriptionController = require('../controllers/subscriptionController');

// Initialize trip after payment (called from web platform)
router.post('/initialize', tripController.initializeTrip);

// Subscription endpoints
router.post('/activate-subscription', subscriptionController.activateSubscription);
router.get('/subscription/:phone', subscriptionController.getSubscriptionStatus);
router.post('/deactivate-subscription', subscriptionController.deactivateSubscription);

// Get trip details
router.get('/:tripId', tripController.getTrip);

// Update budget
router.patch('/:tripId/budget', tripController.updateBudget);

// Get user trips by phone
router.get('/user/:phone', tripController.getUserTrips);

module.exports = router;