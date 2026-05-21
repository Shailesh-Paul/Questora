const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Listing = require('../models/Listing');
const RecommendationEngine = require('../services/recommendationEngine');
const { buildDestinationWordRegex } = require('../utils/destinationMatcher');

// @desc    Get recommendations for a specific destination
// @route   GET /api/recommendations/:destination
router.get('/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const userContext = { role: (req.query.role || 'user').toLowerCase() };
    const regex = buildDestinationWordRegex(destination);

    const propertyQuery = {
      $or: [
        { location: regex },
        { tags: regex },
        { title: regex },
        { description: regex }
      ]
    };

    const properties = await Property.find(propertyQuery);
    const plainProperties = properties.map((p) => p.toObject());

    const listingQuery = {
      category: { $in: ['Stay', 'Homestay', 'Apartment', 'Villa', 'Hotel'] },
      $or: [
        { city: regex },
        { location: regex },
        { state: regex },
        { lowercaseCity: regex },
        { lowercaseLocation: regex },
        { description: regex }
      ]
    };

    const listings = await Listing.find(listingQuery);
    const mappedListings = listings.map((listing) => ({
      _id: listing._id,
      title: listing.title,
      type: (listing.subCategory || listing.category || 'homestay').toLowerCase(),
      price: listing.price || listing.dailyPrice || listing.hourlyPrice || 1500,
      location: listing.location,
      images: Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : (listing.image ? [listing.image] : undefined),
      amenities: listing.facilities || [],
      targetAudience: 'student',
      description: listing.description || `Beautiful stay in ${listing.city}.`,
      rating: listing.rating || 4.5,
      externalBookingUrl: listing.contact ? `tel:${listing.contact}` : 'https://www.makemytrip.com',
      maxGuests: listing.maxGuests || 2,
      popularity: listing.popularity || 60,
      category: 'Stay',
      source: listing.source || listing.category || 'Local Host',
      tags: listing.tags || [],
      isVerified: true
    }));

    const allStays = [...plainProperties, ...mappedListings];
    console.log(`[DEBUG] Recommendation request: ${destination} | Properties: ${plainProperties.length} | Listings: ${mappedListings.length} | Total: ${allStays.length}`);

    const recommendations = RecommendationEngine.getRecommendations(allStays, userContext);
    res.json(recommendations);
  } catch (err) {
    console.error('Recommendation route error:', err);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
});

module.exports = router;
