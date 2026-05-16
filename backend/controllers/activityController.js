const Activity = require('../models/Activity');

// @desc    Get activities by destination (Strict Filtering)
// @route   GET /api/activities/:destination
exports.getActivitiesByDestination = async (req, res) => {
  try {
    const destination = req.params.destination.trim();
    
    // Strict case-insensitive matching
    const activities = await Activity.find({ 
      destination: { $regex: new RegExp(`^${destination}$`, "i") } 
    }).sort({ popularityScore: -1 });

    res.json(activities);
  } catch (err) {
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
  const { budget, lat, lng } = req.query;

  try {
    // STEP 1: Filter STRICTLY by destination first
    const destinationQuery = { 
      destination: { $regex: new RegExp(`^${destination.trim()}$`, "i") } 
    };

    let activities = await Activity.find(destinationQuery);

    if (activities.length === 0) {
      return res.json([]);
    }

    // STEP 2: Apply recommendation scoring logic
    const recommendations = activities.map(act => {
      let score = 0;

      // 1. Destination Match (Fixed 40 since we filtered)
      score += 40;

      // 2. Popularity Score (20 pts)
      score += (act.popularityScore / 100) * 20;

      // 3. Ratings (15 pts)
      score += (act.ratings / 5) * 15;

      // 4. Budget Match (15 pts)
      if (budget) {
        const userBudget = parseFloat(budget);
        if (act.estimatedPrice <= userBudget) {
          score += 15;
        } else if (act.minimumPrice <= userBudget) {
          score += 10;
        }
      } else {
        score += 7.5; 
      }

      // 5. Nearby Distance (10 pts)
      if (lat && lng && act.coordinates) {
        const dist = Math.sqrt(
          Math.pow(act.coordinates.coordinates[0] - parseFloat(lng), 2) + 
          Math.pow(act.coordinates.coordinates[1] - parseFloat(lat), 2)
        );
        const distanceScore = Math.max(0, 10 - (dist * 100)); 
        score += distanceScore;
      } else {
        score += 5;
      }

      return {
        ...act._doc,
        recommendationScore: parseFloat(score.toFixed(2))
      };
    });

    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
    res.json(recommendations.slice(0, 10)); 

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
