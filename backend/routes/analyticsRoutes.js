const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Route for class-specific analytics
// Example: GET /api/analytics/class/60d5f9f8a2b9c01234567890
router.get("/getClassAnalytics/:id", analyticsController.getClassAnalytics);

// Route for financial analytics with monthly/yearly filters
// Example: GET /api/analytics/financial?view=monthly&month=5&year=2025
router.get("/getFinancialAnalytics", analyticsController.getFinancialAnalytics);

module.exports = router;
