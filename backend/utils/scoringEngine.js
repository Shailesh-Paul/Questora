/**
 * Smart Recommendation Scoring Engine
 * Ranks properties based on multiple factors:
 * 1. Role Match (Student/Employee)
 * 2. Budget Fit
 * 3. Rating & Popularity
 * 4. User Preferences (Tags)
 */

const calculatePropertyScore = (property, userContext) => {
  let score = 0;
  const { role, budget, preferences = [] } = userContext;

  // 1. Role Matching (+50 pts)
  // Higher priority for properties targeted at the user's role
  if (property.targetAudience === role) {
    score += 50;
  }

  // 2. Category Priority (+20 pts)
  // Role-specific category preferences
  const type = (property.type || "").toLowerCase();
  if (role === 'student') {
    if (['hostel', 'pg', 'dormitory', 'homestay', 'home'].includes(type)) {
      score += 20;
    }
  } else if (role === 'employee') {
    if (['hotel', 'villa', 'premium apartment', 'resort'].includes(type)) {
      score += 20;
    }
  }

  // 3. Budget Matching (+30 pts)
  // If property price is within user's per-night budget
  if (property.price <= budget) {
    score += 30;
    // Extra boost if it's a great deal (well below budget)
    if (property.price <= budget * 0.7) {
      score += 10;
    }
  } else {
    // Penalty for being over budget
    const overage = property.price / budget;
    if (overage > 1.5) score -= 20;
    else if (overage > 1.2) score -= 10;
  }

  // 4. Quality & Popularity (+25 pts max)
  const rating = property.rating || 0;
  score += rating * 4; // Max 20 pts for 5 stars

  const popularity = property.popularity || 0;
  score += Math.min(popularity / 10, 5); // Max 5 pts for popularity

  // 5. User Preferences (Tags) (+15 pts per match)
  if (preferences.length > 0 && property.tags) {
    preferences.forEach(pref => {
      if (property.tags.includes(pref)) {
        score += 15;
      }
    });
  }

  return score;
};

const rankProperties = (properties, userContext) => {
  return properties
    .map(p => ({
      ...p.toObject ? p.toObject() : p,
      recommendationScore: calculatePropertyScore(p, userContext)
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

module.exports = { calculatePropertyScore, rankProperties };
