const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { upload } = require('../config/cloudinary');

// @route   POST api/listings
// @desc    Create a new property listing with images
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, location, price, category, contact, ownerName } = req.body;
    
    // Get URLs from uploaded files
    const imageUrls = req.files.map(file => file.path);

    const newListing = new Listing({
      title,
      description,
      location,
      price,
      category,
      contact,
      ownerName,
      images: imageUrls
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/listings
// @desc    Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
