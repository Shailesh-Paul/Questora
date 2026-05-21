/**
 * AI Planner Service
 * Centralizes OpenAI logic for generating destination plans, budgets, and recommendations.
 */

const OpenAI = require('openai');
const Activity = require('../models/Activity');

class AIPlanner {
  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      this.openai = null;
    }
  }

  /**
   * Generates a curated travel bundle based on destination and budget.
   * 
   * @param {Object} context - The context including destination, budget, interests
   * @returns {Promise<Object>} - The AI generated bundle
   */
  async generateBundle({ destination, budget, interests = [], selectedActivities = [] }) {
    if (!this.openai) {
      return { 
        message: "AI recommendations are currently unavailable. Please configure OPENAI_API_KEY in the backend .env file.",
        bundleName: "Questora Smart Bundle",
        activities: [],
        totalPrice: 0,
        rationale: "AI is offline.",
        proTip: "Try exploring local markets for authentic food!"
      };
    }

    try {
      const availableActivities = await Activity.find({ 
        destination: new RegExp(`^${destination}$`, 'i') 
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

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("AI Bundle Error:", error);
      throw new Error("Failed to generate AI bundle");
    }
  }
}

module.exports = new AIPlanner();
