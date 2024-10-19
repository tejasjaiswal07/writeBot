const Writing = require('../models/Writing');
const User = require('../models/User');
const analysisService = require('../services/analysisService');
const generationService = require('../services/generationService');
const aiService = require('../services/aiService');
const cacheService = require('../services/cacheService');
const subscriptionService = require('../services/subscriptionService');
const { ValidationError, AuthorizationError } = require('../utils/errors');
const logger = require('../utils/logger');

exports.analyzeText = async (req, res, next) => {
  try {
    const { content, title } = req.body;
    if (!content || content.trim().length === 0) {
      throw new ValidationError('Content is required');
    }

    await subscriptionService.validateUserAction(req.user, 'analyze');

    const cacheKey = `analysis:${req.user._id}:${content.substring(0, 50)}`;
    const cachedAnalysis = await cacheService.get(cacheKey);

    if (cachedAnalysis) {
      logger.info(`Cache hit for analysis: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedAnalysis));
    }

    const analysis = await analysisService.analyze(content);
    const writing = new Writing({
      user: req.user._id,
      content,
      title,
      analysis
    });

    await writing.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { writings: writing._id } });

    await cacheService.set(cacheKey, JSON.stringify(writing), 3600); // Cache for 1 hour

    res.status(201).json(writing);
  } catch (error) {
    next(error);
  }
};

exports.generateContent = async (req, res, next) => {
  try {
    const { writingId, prompt, style, length } = req.body;
    const writing = await Writing.findById(writingId);
    
    if (!writing) {
      throw new ValidationError('Writing not found');
    }

    if (writing.user.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Unauthorized access to writing');
    }

    await subscriptionService.validateUserAction(req.user, 'generate');

    const generatedContent = await generationService.generate(prompt, writing.content, style, length);
    writing.generatedContent = generatedContent;
    await writing.save();

    // Analyze the generated content
    const analysis = await analysisService.analyze(generatedContent);
    writing.generatedAnalysis = analysis;
    await writing.save();

    res.json({ generatedContent, analysis });
  } catch (error) {
    next(error);
  }
};

exports.getWritingHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const writings = await Writing.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-content -generatedContent');

    const total = await Writing.countDocuments({ user: req.user._id });

    res.json({
      writings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalWritings: total
    });
  } catch (error) {
    next(error);
  }
};

// ... (other methods like getWritingById, deleteWriting remain the same)
// genrate getWritingById
exports.getWritingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const writing = await Writing.findById(id);
        if (!writing || writing.user.toString() !== req.user._id.toString()) {
            throw new AuthorizationError('Writing not found or unauthorized');
        }
        res.json({ writing });
    } catch (error) {
        next(error);
    }
};

exports.getBotSuggestions = async (req, res, next) => {
  try {
    const { writingId, topic } = req.body;
    const writing = await Writing.findById(writingId);
    if (!writing || writing.user.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Writing not found or unauthorized');
    }

    await subscriptionService.validateUserAction(req.user, 'getSuggestions');

    const suggestions = await aiService.getSuggestions(writing.content, topic);
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

exports.analyzeWritingStyle = async (req, res, next) => {
  try {
    const { writingId } = req.params;
    const writing = await Writing.findById(writingId);
    if (!writing || writing.user.toString() !== req.user._id.toString()) {
      throw new AuthorizationError('Writing not found or unauthorized');
    }

    await subscriptionService.validateUserAction(req.user, 'analyzeStyle');

    const styleAnalysis = await aiService.analyzeStyle(writing.content);
    res.json({ styleAnalysis });
  } catch (error) {
    next(error);
  }
};

exports.generateOutline = async (req, res, next) => {
  try {
    const { topic, length } = req.body;

    await subscriptionService.validateUserAction(req.user, 'generateOutline');

    const outline = await aiService.generateOutline(topic, length);
    res.json({ outline });
  } catch (error) {
    next(error);
  }
};

exports.deleteWriting = async (req, res, next) => {
    try {
      const { id } = req.params;
      const writing = await Writing.findById(id);
      
      if (!writing) {
        throw new ValidationError('Writing not found');
      }
  
      if (writing.user.toString() !== req.user._id.toString()) {
        throw new AuthorizationError('Unauthorized access to writing');
      }
  
      await Writing.findByIdAndDelete(id);
      await User.findByIdAndUpdate(req.user._id, { $pull: { writings: id } });
  
      res.status(200).json({ message: 'Writing deleted successfully' });
    } catch (error) {
      next(error);
    }
  };