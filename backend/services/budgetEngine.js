/**
 * Budget Engine Service
 * Centralizes logic for trip budget estimations.
 */

const Destination = require('../models/Destination');

class BudgetEngine {
  /**
   * Estimates the minimum daily budget for a destination.
   * 
   * @param {String} destination - The destination
   * @returns {Promise<Number>} - Estimated budget
   */
  static async estimateDailyBudget(destination) {
    if (!destination) {
      throw new Error("Destination is required.");
    }

    const regex = new RegExp(`^${destination}$`, "i");
    const dest = await Destination.findOne({ name: regex });

    if (dest && dest.baseBudgetPerDay) {
      return dest.baseBudgetPerDay;
    }

    // Fallback default budget
    return 3000;
  }
}

module.exports = BudgetEngine;
