const express = require('express');
const router = express.Router();
const { getHealthAnalysis, getFireRoadmap, getTaxStrategy, getChatResponse, getMFAnalysis } = require('../utils/ai');
const ChatHistory = require('../models/ChatHistory');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
    try {
        const { message, history } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const reply = await getChatResponse(message, history || []);

        // Save to Database
        let chatRecord = await ChatHistory.findOne({ userId });
        const timestamp = new Date();
        const newMessages = [{ role: 'user', content: message, timestamp }, { role: 'assistant', content: reply, timestamp }];

        if (!chatRecord) {
            chatRecord = new ChatHistory({ userId, messages: newMessages });
        } else {
            chatRecord.messages.push(...newMessages);
        }
        await chatRecord.save();

        res.status(200).json({ success: true, data: { reply } });
    } catch (err) {
        next(err);
    }
});

// New Specialized LLM Routes
router.post('/health-analysis', async (req, res, next) => {
    try {
        const { answers } = req.body;
        const analysis = await getHealthAnalysis(answers);
        res.json({ success: true, data: { analysis } });
    } catch (err) {
        next(err);
    }
});

router.post('/fire-roadmap', async (req, res, next) => {
    try {
        const { params } = req.body;
        const roadmap = await getFireRoadmap(params);
        res.json({ success: true, data: { roadmap } });
    } catch (err) {
        next(err);
    }
});

router.post('/tax-strategy', async (req, res, next) => {
    try {
        const { data } = req.body;
        const strategy = await getTaxStrategy(data);
        res.json({ success: true, data: { strategy } });
    } catch (err) {
        next(err);
    }
});

router.post('/mf-analysis', async (req, res, next) => {
    try {
        const { isDemo } = req.body;
        const analysis = await getMFAnalysis(isDemo);
        res.json({ success: true, data: { analysis } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
