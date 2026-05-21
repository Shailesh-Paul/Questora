/**
 * Activity Engine Service
 * Handles destination-based strict filtering and activity sorting.
 */

const Activity = require('../models/Activity');
const { buildDestinationRegex } = require('../utils/destinationMatcher');

class ActivityEngine {
  /**
   * Fetches activities strictly for a specific destination.
   * Prevents activities from mixing across destinations.
   * 
   * @param {String} destination - The name of the destination
   * @returns {Promise<Array>} - List of matching activities
   */
  static async getActivitiesForDestination(destination) {
    if (!destination) {
      throw new Error("Destination is required to fetch activities.");
    }

    const exactRegex = buildDestinationRegex(destination);

    return await Activity.find({ destination: exactRegex }).sort({ popularityScore: -1 });
  }

  /**
   * Recommends activities based on budget and location.
   * 
   * @param {String} destination - The name of the destination
   * @param {Number} budget - Maximum budget
   * @param {String} userRole - Optional user role to prioritize suggestions
   * @returns {Promise<Array>} - Curated list of activities
   */
  static async getRecommendedActivities(destination, budget, userRole) {
    const exactRegex = buildDestinationRegex(destination);

    const query = { destination: exactRegex };
    
    if (budget) {
      query.estimatedPrice = { $lte: Number(budget) };
    }

    const activities = await Activity.find(query).lean();

    return activities
      .map((activity) => {
        let score = activity.popularityScore || 0;

        if (userRole) {
          const role = userRole.toLowerCase();
          if (role.includes('adventure')) {
            if (activity.category?.toLowerCase()?.includes('adventure') || activity.category?.toLowerCase()?.includes('water')) score += 20;
          }
          if (role.includes('spiritual')) {
            if (activity.category?.toLowerCase()?.includes('spiritual') || activity.category?.toLowerCase()?.includes('historical')) score += 20;
          }
          if (role.includes('student')) {
            if (activity.estimatedPrice <= 1500) score += 15;
          }
          if (role.includes('employee')) {
            if (activity.estimatedPrice >= 2000) score += 15;
          }
        }

        return { ...activity, aiScore: score };
      })
      .sort((a, b) => {
        if (b.aiScore !== a.aiScore) return b.aiScore - a.aiScore;
        return (a.estimatedPrice || 0) - (b.estimatedPrice || 0);
      });
  }
}

module.exports = ActivityEngine;
