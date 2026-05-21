const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get budget estimation for a destination
// @route   GET /api/budget/:destination
exports.getDestinationBudget = async (req, res) => {
  try {
    const dest = await Destination.findOne({ 
      city: { $regex: new RegExp('^' + req.params.destination + '$', 'i') } 
    });
    
    if (!dest) return res.status(404).json({ message: "Destination not found" });

    // Returns average costs for stay, food, transport
    res.json({
      city: dest.city,
      averageStayCost: dest.averageStayCost,
      averageFoodCost: dest.averageFoodCost,
      averageTransportCost: dest.averageTransportCost,
      totalDailyEstimate: dest.averageStayCost + dest.averageFoodCost + dest.averageTransportCost
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
