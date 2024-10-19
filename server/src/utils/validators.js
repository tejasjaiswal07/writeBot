const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email()
});

exports.upgradeSubscriptionSchema = Joi.object({
  plan: Joi.string().valid('pro', 'enterprise').required()
});

exports.analyzeTextSchema = Joi.object({
  content: Joi.string().required(),
  title: Joi.string()
});

exports.generateContentSchema = Joi.object({
  writingId: Joi.string().required(),
  prompt: Joi.string().required(),
  style: Joi.string(),
  length: Joi.number().integer().min(50).max(5000)
});

exports.botSuggestionsSchema = Joi.object({
  writingId: Joi.string().required(),
  topic: Joi.string().required()
});

exports.generateOutlineSchema = Joi.object({
  topic: Joi.string().required(),
  length: Joi.number().integer().min(100).max(10000)
});