const express = require('express');
const router = express.Router();
const BudgetEngine = require('../services/budgetEngine');

// @desc    Get daily budget estimate for a destination
// @route   GET /api/budget/:destination
router.get('/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    const budget = await BudgetEngine.estimateDailyBudget(destination);
    
    res.json({
      destination,
      estimatedDailyBudget: budget
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
