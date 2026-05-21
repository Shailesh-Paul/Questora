const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const OpenAI = require('openai');

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// @desc    Parse natural language cash entry (NLP Autocomplete)
// @route   POST /api/ai-expenses/nlp
router.post('/nlp', protect, async (req, res) => {
  if (!openai) {
    return res.status(503).json({ message: "AI Assistant is currently offline." });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Input text is required' });
  }

  try {
    const prompt = `As a smart travel accountant, parse the following expense description text and return a JSON object with:
    1. "amount": Number (the cost in Rupees).
    2. "category": String (exactly one of: 'travel', 'hotel', 'activity', 'rentals', 'food', 'shopping', 'transport').
    3. "description": String (a short, polished title for the expense).
    
    If the category is unclear, match it logically:
    - transport: flights, trains, cabs, bus, auto, metro, petrol, toll, tickets
    - food: snacks, coffee, dinner, lunch, drinks, dining, cafe, grocery
    - activity: rafting, museum, sightseeing, tickets, adventure, guide
    - rentals: vehicle rentals, homestay rentals, equipment
    - hotel: homestay, dorm, hostel, lodging
    - shopping: gifts, souvenirs, clothes, electronics
    - travel: luggage, visa, overall tour package
    
    Text to parse: "${text}"
    Return strictly JSON in this format: { "amount": Number, "category": String, "description": String }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("AI NLP parsing error:", error);
    res.status(500).json({ message: "Failed to parse expense text" });
  }
});

// @desc    Perform OCR receipt scanning using OpenAI Vision
// @route   POST /api/ai-expenses/ocr
router.post('/ocr', protect, async (req, res) => {
  if (!openai) {
    return res.status(503).json({ message: "AI OCR scanner is currently offline." });
  }

  const { image } = req.body; // Expects a base64 encoded image string: "data:image/jpeg;base64,..."
  if (!image) {
    return res.status(400).json({ message: 'Base64 image is required for receipt scanning' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an OCR receipt scanning engine. Analyze the uploaded receipt image and return a JSON object with:
              - "merchant": String (merchant name or store name)
              - "amount": Number (total transaction cost)
              - "category": String (exactly one of: 'travel', 'hotel', 'activity', 'rentals', 'food', 'shopping', 'transport')
              - "description": String (brief summary of items bought)
              - "date": String (estimated transaction date or invoice date if visible, otherwise return null)
              
              Return strictly JSON in the specified format.`
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("AI OCR parsing error:", error);
    res.status(500).json({ message: "Failed to extract receipt data. Make sure it is a valid receipt image." });
  }
});

// @desc    Generate personalized AI travel budget insights
// @route   POST /api/ai-expenses/insights
router.post('/insights', protect, async (req, res) => {
  if (!openai) {
    return res.status(503).json({ message: "AI Insights engine is currently offline." });
  }

  const { expenses, budget } = req.body;
  if (!expenses) {
    return res.status(400).json({ message: 'Expenses data is required' });
  }

  try {
    const prompt = `As a friendly AI Travel Budgeting Coach, analyze the traveler's expenses and budget.
    Total Budget: ₹${budget || 25000}
    Expenses List: ${JSON.stringify(expenses.map(e => ({ amount: e.amount, category: e.category, description: e.description })))}
    
    Generate three highly constructive, short, personalized financial insights or saving tips (max 2 sentences per tip).
    Format the output as a JSON object with:
    {
      "insights": [
        "Tip 1...",
        "Tip 2...",
        "Tip 3..."
      ],
      "overallGrade": "String (e.g. Excellent, On Track, Caution, Over-spending)"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    res.json(parsed);
  } catch (error) {
    console.error("AI Insights compilation error:", error);
    res.status(500).json({ message: "Failed to compile travel expense insights" });
  }
});

module.exports = router;
