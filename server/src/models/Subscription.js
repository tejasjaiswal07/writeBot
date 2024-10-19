const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  usage: {
    analyze: { type: Number, default: 0 },
    generate: { type: Number, default: 0 },
    getSuggestions: { type: Number, default: 0 },
    analyzeStyle: { type: Number, default: 0 },
    generateOutline: { type: Number, default: 0 }
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);