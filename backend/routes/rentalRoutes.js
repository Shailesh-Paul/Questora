const express = require('express');
const router = express.Router();
const RentalEngine = require('../services/rentalEngine');
const PricingEngine = require('../services/pricingEngine');

// @desc    Get rentals (vehicles) by destination
// @route   GET /api/rentals/:destination
router.get('/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const { hours } = req.query; // optional hours for price calculation

    let vehicles = await RentalEngine.getAvailableVehicles(destination);

    // Apply pricing engine logic if hours are provided
    if (hours) {
      const parsedHours = parseInt(hours, 10);
      vehicles = vehicles.map(v => {
        const pricing = PricingEngine.calculateRentalPrice(v.hourlyPrice || v.pricePerHour, parsedHours);
        return {
          ...v,
          calculatedPrice: pricing
        };
      });
    }

    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
