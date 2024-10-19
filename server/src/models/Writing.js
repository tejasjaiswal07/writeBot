const mongoose = require('mongoose');

const writingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  title: String,
  analysis: {
    wordCount: Number,
    sentenceCount: Number,
    readabilityScore: Number,
    // Add more analysis fields as needed
  },
  generatedContent: String,
  generatedAnalysis: {
    wordCount: Number,
    sentenceCount: Number,
    readabilityScore: Number,
    // Add more analysis fields as needed
  }
}, { timestamps: true });

module.exports = mongoose.model('Writing', writingSchema);