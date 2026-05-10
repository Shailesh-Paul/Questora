const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { upload } = require('../config/cloudinary');

// @route   POST api/listings
// @desc    Create a new property listing with images
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, location, price, category, contact, ownerName, pricingType, hourlyPrice, dailyPrice, vehicleNumber, vehicleModel } = req.body;
    
    // Get URLs from uploaded files
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const newListing = new Listing({
      title,
      description,
      location,
      price: price || hourlyPrice || dailyPrice, // Fallback
      category,
      contact,
      ownerName,
      pricingType,
      hourlyPrice,
      dailyPrice,
      vehicleNumber,
      vehicleModel,
      images: imageUrls
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error("Listing POST Error:", err);
    res.status(500).json({ error: err.message || 'Server Error during listing creation' });
  }
});

// @route   GET api/listings
// @desc    Get all listings or filter by location/category
router.get('/', async (req, res) => {
  try {
    const { location, category } = req.query;
    let query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (category) query.category = category;

    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
