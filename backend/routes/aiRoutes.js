const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Activity = require('../models/Activity');

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// @desc    Generate travel bundle using AI
// @route   POST /api/ai/bundle
router.post('/bundle', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ 
      message: "AI recommendations are currently unavailable. Please configure OPENAI_API_KEY in the backend .env file.",
      bundleName: "Questora Smart Bundle",
      activities: [],
      totalPrice: 0,
      rationale: "AI is offline.",
      proTip: "Try exploring local markets for authentic food!"
    });
  }

  const { destination, budget, interests, selectedActivities = [] } = req.body;

  try {
    // Fetch available activities for the destination to provide context to AI
    const availableActivities = await Activity.find({ 
      destination: { $regex: destination, $options: 'i' } 
    });

    const prompt = `
      You are an expert travel planner for Questora. 
      Destination: ${destination}
      User Budget: ₹${budget}
      User Interests: ${interests.join(', ')}
      Already Selected: ${selectedActivities.join(', ')}
      
      Available Activities in Questora Database:
      ${availableActivities.map(a => `- ${a.name} (₹${a.estimatedPrice || a.price})`).join('\n')}
      
      Task: 
      1. Recommend a "Smart Travel Bundle" that combines 3-4 activities.
      2. Ensure the total price is within budget.
      3. Explain why this bundle is great for the user.
      4. Suggest a "Pro Tip" for this specific destination.
      
      Return the response in JSON format:
      {
        "bundleName": "...",
        "activities": ["...", "..."],
        "totalPrice": 0,
        "rationale": "...",
        "proTip": "..."
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" }
    });

    const recommendation = JSON.parse(completion.choices[0].message.content);
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
