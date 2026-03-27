const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    income: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    goals: [{ type: String }],
    healthScore: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Finance', FinanceSchema);
