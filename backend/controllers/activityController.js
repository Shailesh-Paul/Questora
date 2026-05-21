const ActivityEngine = require('../services/activityEngine');
const Activity = require('../models/Activity'); // Keep for nearby query if not in engine yet

// @desc    Get activities by destination (Strict Filtering)
// @route   GET /api/activities/:destination
exports.getActivitiesByDestination = async (req, res) => {
  try {
    const destination = decodeURIComponent(req.params.destination).trim();
    const { role, budget } = req.query;

    let activities = await ActivityEngine.getActivitiesForDestination(destination);

    if (role || budget) {
      activities = await ActivityEngine.getRecommendedActivities(destination, budget, role);
    }

    console.log(
      `[DEBUG] Activities ${destination} | role=${role || 'none'} | count=${activities.length}`
    );
    res.json(activities);
  } catch (err) {
    console.error('Activity fetch error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get nearby activities within a destination radius
// @route   GET /api/activities/nearby/:destination
exports.getNearbyActivities = async (req, res) => {
  const { destination } = req.params;
  const { lng, lat, maxDistance = 5000 } = req.query;

  if (!lng || !lat) {
    return res.status(400).json({ message: "Longitude and Latitude are required" });
  }

  try {
    const activities = await Activity.find({
      destination: { $regex: new RegExp(`^${destination.trim()}$`, "i") },
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get recommendations ONLY for the selected destination
// @route   GET /api/recommendations/:destination
exports.getRecommendations = async (req, res) => {
  const { destination } = req.params;
  const { budget, role } = req.query;

  try {
    const recommendations = await ActivityEngine.getRecommendedActivities(destination, budget, role);
    console.log(`[DEBUG] Activity recommendations for ${destination} | role=${role || 'default'} | count=${recommendations.length}`);
    res.json(recommendations.slice(0, 10));
  } catch (err) {
    console.error('Activity recommendation error:', err);
    res.status(500).json({ message: err.message });
  }
};
