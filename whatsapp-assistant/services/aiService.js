const axios = require('axios');
require('dotenv').config();

class AIMinimaxService {
  constructor() {
    this.minimaxApiKey = process.env.MINIMAX_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.minimax.chat/v1';
  }

  async generateResponse(messages, userContext = {}) {
    try {
      // Build system prompt with user context
      const systemPrompt = this.buildSystemPrompt(userContext);

      // Prepare messages array
      const allMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      // Try MiniMax first
      try {
        const response = await axios.post(
          `${this.baseUrl}/chat/completions`,
          {
            model: 'minimax-m2.5',
            messages: allMessages,
            temperature: 0.3,
            max_tokens: 200
          },
          {
            headers: {
              'Authorization': `Bearer ${this.minimaxApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          success: true,
          response: response.data.choices[0].message.content,
          model: 'minimax'
        };
      } catch (minimaxError) {
        console.log('MiniMax failed, trying OpenAI fallback...');

        // Fallback to OpenAI
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: allMessages,
            temperature: 0.3,
            max_tokens: 200
          },
          {
            headers: {
              'Authorization': `Bearer ${this.openaiApiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          success: true,
          response: openaiResponse.data.choices[0].message.content,
          model: 'openai'
        };
      }
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  buildSystemPrompt(userContext) {
    const {
      userName = 'Traveler',
      destination = '',
      remainingBudget = 0,
      dailyLimit = 0,
      nextActivity = null,
      hotelLocation = '',
      activities = [],
      isEmergencyMode = false
    } = userContext;

    let prompt = `You are Questora, a friendly and knowledgeable travel companion. You're like a helpful local friend who knows all the best spots!

YOUR STYLE:
- Talk naturally like a human friend, not a robot
- Use casual, friendly language with some emojis
- Be conversational and engaging
- Don't be overly formal - relax and be yourself!

CURRENT USER INFO:
- Name: ${userName}
- Currently in: ${destination}
- Budget left: ₹${remainingBudget.toLocaleString('en-IN')}
- Today's budget: ₹${dailyLimit.toLocaleString('en-IN')}
- Staying at: ${hotelLocation || 'Hotel not set'}

`;

    if (isEmergencyMode) {
      prompt += `⚠️ Heads up! Budget is running low. Let's find some good free or cheap stuff!

`;
    }

    if (nextActivity) {
      prompt += `📍 Coming up soon (30 mins): ${nextActivity.title}
   Location: ${nextActivity.location_name || 'TBD'}
   Est. cost: ₹${nextActivity.estimated_cost || 0}

`;
    }

    if (activities.length > 0) {
      const activityList = activities
        .slice(0, 5)
        .map(a => `• ${a.name} - ₹${a.price || 0}`)
        .join('\n');
      prompt += `Nearby options I found:
${activityList}

`;
    }

    prompt += `SOME RULES:
1. Keep it short and sweet (under 50 words)
2. Add relevant emojis but don't overdo it
3. Always check if suggestions fit the budget
4. If something's too expensive, suggest cheaper alternatives honestly
5. Only use real places I mentioned - don't make up fake ones!
6. Be genuinely helpful and suggest things they'd actually enjoy

Start with a friendly greeting if they say hi/hello/namaste!

Remember: You're their travel buddy, not a dictionary! 🤗`;

    return prompt;
  }

  async classifyIntent(userMessage) {
    try {
      const response = await this.generateResponse([
        {
          role: 'user',
          content: `Classify this message into ONE of these intents: GENERAL_CHAT, FIND_FOOD, FIND_PLACE, COMMUTE_INQUIRY, WEATHER_CHECK, EXPENSE_LOG, SCHEDULE_INQUIRY, BUDGET_CHECK

Message: "${userMessage}"

Reply ONLY with the intent word, nothing else.`
        }
      ]);

      if (response.success) {
        const intent = response.response.trim().toUpperCase();
        return intent;
      }

      return 'GENERAL_CHAT';
    } catch (error) {
      console.error('Intent classification error:', error);
      return 'GENERAL_CHAT';
    }
  }
}

module.exports = new AIMinimaxService();