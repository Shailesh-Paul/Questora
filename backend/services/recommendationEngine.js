/**
 * Recommendation Engine Service
 * Handles scoring and prioritizing properties based on user role and preferences.
 */

class RecommendationEngine {
  /**
   * Generates a recommendation score for a given property based on the user's role.
   * Student priority: Hostel > PG > Homestay > Dormitory > Hotel
   * Employee priority: Hotel > Villa > Apartment > Resort
   * 
   * @param {Object} property - The property object from DB
   * @param {Object} user - The user object from DB (contains role)
   * @returns {Number} - The computed score
   */
  static calculateScore(property, user) {
    let score = 0;
    const role = (user?.role || 'user').toLowerCase();
    const type = (property.type || '').toLowerCase();

    // Baseline scoring based on raw ratings or defaults
    score += (property.rating || 4.0) * 5; 

    if (role === 'student') {
      if (type === 'hostel') score += 40;
      else if (type === 'dormitory') score += 35;
      else if (type === 'homestay') score += 30;
      else if (type === 'hotel') score += 15;
    } else if (role === 'employee' || role === 'admin') {
      if (type === 'hotel') score += 40;
      else if (type === 'villa') score += 35;
      else if (type === 'apartment') score += 30;
      else if (type === 'hostel') score += 10;
    } else if (role.includes('adventure')) {
      if (type === 'hostel') score += 35;
      else if (type === 'villa') score += 25;
      else if (type === 'hotel') score += 20;
      else if (type === 'homestay') score += 30;
    } else if (role.includes('spiritual')) {
      if (type === 'homestay') score += 40;
      else if (type === 'hotel') score += 30;
      else if (type === 'villa') score += 20;
      else if (type === 'hostel') score += 10;
    }

    // Boost score for verified or highly trusted properties
    if (property.isVerified) score += 10;

    return score;
  }

  /**
   * Sorts an array of properties based on the calculated score.
   * 
   * @param {Array} properties - Array of property objects
   * @param {Object} user - The user context
   * @returns {Array} - Sorted properties (highest score first)
   */
  static getRecommendations(properties, user) {
    if (!properties || !Array.isArray(properties)) return [];
    
    return properties
      .map(prop => ({
        ...prop.toObject ? prop.toObject() : prop,
        recommendationScore: this.calculateScore(prop, user)
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }
}

module.exports = RecommendationEngine;
