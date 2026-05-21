const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');
const { rankProperties } = require('../utils/scoringEngine');


// @desc    Get recommended properties based on user role
// @route   GET /api/properties/recommended
// @access  Private
router.get('/recommended', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const budget = req.query.budget ? Number(req.query.budget) : 5000;
    
    const properties = await Property.find({});
    const ranked = rankProperties(properties, { role, budget });
    
    res.json(ranked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all properties with ranking
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
  const { type, minPrice, maxPrice, location, role, budget, preferences } = req.query;
  let query = {};

  if (type) query.type = type;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const properties = await Property.find(query);
    
    // If role and budget are provided, rank them. Otherwise return as is.
    if (role && budget) {
      const userContext = {
        role,
        budget: Number(budget),
        preferences: preferences ? preferences.split(',') : []
      };
      const ranked = rankProperties(properties, userContext);
      return res.json(ranked);
    }
    
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (In a real app, only admins/owners should do this)
router.post('/', protect, async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
