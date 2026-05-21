const express = require('express');
const router = express.Router();
const AIPlanner = require('../services/aiPlanner');
const OpenAI = require('openai'); // kept for the other route if not refactored yet

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// @desc    Generate travel bundle using AI
// @route   POST /api/ai/bundle
router.post('/bundle', async (req, res) => {
  const { destination, budget, interests, selectedActivities = [] } = req.body;

  try {
    const recommendation = await AIPlanner.generateBundle({
      destination,
      budget,
      interests,
      selectedActivities
    });
    
    res.json(recommendation);
  } catch (error) {
    console.error("AI Bundle Error:", error);
    res.status(500).json({ message: "Failed to generate AI bundle" });
  }
});


// @desc    Get AI Vehicle recommendations based on terrain and group size
// @route   POST /api/ai/vehicle-recommendation
router.post('/vehicle-recommendation', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ message: "AI is currently offline." });
  }

  const { destination, members, budget, terrainInfo } = req.body;

  try {
    const prompt = `As a travel vehicle expert, recommend the best vehicle type for ${destination} (Terrain: ${terrainInfo}). 
    Group size: ${members} people. Budget per day: ₹${budget}.
    Consider:
    - Manali/Hills: Priority Bikes/Off-road cars.
    - Goa/Beaches: Priority Scooty/Cycles/Convertibles.
    - Jaipur/City: Priority Hatchbacks/Cycles.
    Return JSON: { recommendedCategory, reason, tip }`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    res.json(JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error("AI Vehicle Error:", error);
    res.status(500).json({ message: "Failed to generate AI recommendation" });
  }
});

module.exports = router;
