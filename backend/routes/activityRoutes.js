const express = require('express');
const router = express.Router();
const { 
  getActivitiesByDestination, 
  getNearbyActivities, 
  getRecommendations 
} = require('../controllers/activityController');

// @desc    Get nearby activities restricted by destination
// @route   GET /api/activities/nearby/:destination
router.get('/nearby/:destination', getNearbyActivities);

// @desc    Get activities by destination
// @route   GET /api/activities/:destination
router.get('/:destination', getActivitiesByDestination);

// @desc    Get recommendations by destination
// @route   GET /api/recommendations/:destination
router.get('/recommendations/:destination', getRecommendations);

module.exports = router;
