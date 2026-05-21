const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');
const Listing = require('../models/Listing');
const RecommendationEngine = require('../services/recommendationEngine');
const jwt = require('jsonwebtoken');

// Helper to extract role from optional token
const getRoleFromToken = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return 'user';
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'questora_secret_key_2024');
    return decoded.role || 'user';
  } catch (err) {
    return 'user';
  }
};

// GET /api/accommodations/:destination
router.get('/:destination', async (req, res) => {
  try {
    const destination = req.params.destination;
    const regex = new RegExp(destination, "i");

    // Fetch pre-seeded accommodations
    const accommodations = await Accommodation.find({
      destination: { $regex: new RegExp(`^${destination}$`, 'i') }
    });
    const plainAccommodations = accommodations.map(a => a.toObject());

    // Fetch user-hosted listings matching destination
    const listings = await Listing.find({
      category: { $in: ["Stay", "Homestay"] },
      $or: [
        { city: regex },
        { location: regex }
      ]
    });

    const mappedListings = listings.map(listing => ({
      _id: listing._id,
      title: listing.title,
      destination: listing.location,
      type: listing.subCategory || 'homestay',
      description: listing.description || `Beautiful stay in ${listing.city}. Hosted by ${listing.ownerName}.`,
      images: listing.images && listing.images.length > 0 ? listing.images : ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"],
      pricePerNight: listing.price || 1500,
      ratings: 4.5,
      amenities: listing.facilities || [],
      bookingPlatform: `Host: ${listing.ownerName}`,
      externalBookingLink: listing.contact ? `tel:${listing.contact}` : 'https://www.makemytrip.com'
    }));

    res.json([...plainAccommodations, ...mappedListings]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accommodations' });
  }
});

// GET /api/accommodations/recommendations/:destination
router.get('/recommendations/:destination', async (req, res) => {
  try {
    const destination = req.params.destination;
    const regex = new RegExp(destination, "i");
    // Allow explicitly passing role via query, else decode token
    const role = req.query.role || getRoleFromToken(req);

    const properties = await Accommodation.find({
      destination: { $regex: new RegExp(`^${destination}$`, 'i') }
    });
    const plainProperties = properties.map(a => a.toObject());

    const listings = await Listing.find({
      category: { $in: ["Stay", "Homestay"] },
      $or: [
        { city: regex },
        { location: regex }
      ]
    });

    const mappedListings = listings.map(listing => ({
      _id: listing._id,
      title: listing.title,
      type: listing.subCategory || 'homestay',
      price: listing.price || 1500,
      location: listing.location,
      images: listing.images && listing.images.length > 0 ? listing.images : ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800"],
      amenities: listing.facilities || [],
      targetAudience: 'student',
      description: listing.description || `Beautiful stay in ${listing.city}. Hosted by ${listing.ownerName}.`,
      rating: 4.5,
      externalBookingUrl: listing.contact ? `tel:${listing.contact}` : 'https://www.makemytrip.com',
      maxGuests: listing.maxGuests || 2,
      popularity: 85,
      category: 'Stay',
      source: `Host: ${listing.ownerName}`,
      tags: ['local', 'homestay'],
      isVerified: true
    }));

    const allStays = [...plainProperties, ...mappedListings];

    const recommendations = RecommendationEngine.getRecommendations(allStays, { role });
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
