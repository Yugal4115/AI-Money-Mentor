const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all finance routes
router.use(authMiddleware);

// POST /api/finance/save
router.post('/save', async (req, res, next) => {
    try {
        const { income, expenses, savings, goals } = req.body;
        const userId = req.user.id;

        // Calculate healthScore: Math.min(100, Math.round((savings / income) * 100 * 2.5))
        let healthScore = 0;
        if (income > 0) {
            healthScore = Math.min(100, Math.round((savings / income) * 100 * 2.5));
        }

        const financeData = await Finance.findOneAndUpdate(
            { userId },
            { 
                income: income || 0, 
                expenses: expenses || 0, 
                savings: savings || 0, 
                goals: goals || [], 
                healthScore,
                updatedAt: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, data: financeData });
    } catch (err) {
        next(err);
    }
});

// GET /api/finance/summary
router.get('/summary', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const financeData = await Finance.findOne({ userId });

        if (!financeData) {
            // Return defaults if no data
            return res.status(200).json({
                success: true,
                data: { income: 0, expenses: 0, savings: 0, goals: [], healthScore: 0 }
            });
        }

        res.status(200).json({ success: true, data: financeData });
    } catch (err) {
        next(err);
    }
});

// GET /api/finance/alerts
router.get('/alerts', async (req, res, next) => {
    try {
        const userId = req.user.id;
        const financeData = await Finance.findOne({ userId });

        if (!financeData) {
            return res.status(200).json({ success: true, data: ["Please add your financial data to receive personalized alerts!"] });
        }

        const { income, expenses, savings } = financeData;
        const alerts = [];

        if (income === 0) {
            alerts.push("It looks like you haven't added any income yet. Start by setting your monthly income.");
            return res.status(200).json({ success: true, data: alerts });
        }

        const savingsRate = (savings / income) * 100;
        const expenseRate = (expenses / income) * 100;

        if (savingsRate < 10) {
            alerts.push("You're saving less than 10% of your income.");
        } else if (savingsRate >= 20) {
            alerts.push("Great job! You're on track with your savings goals.");
        }

        if (expenseRate > 80) {
            alerts.push("Your expenses exceed 80% of your income — review your budget.");
        }

        if (alerts.length === 0) {
            alerts.push("Your finances look balanced right now. Keep up the good work!");
        }

        res.status(200).json({ success: true, data: alerts });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
