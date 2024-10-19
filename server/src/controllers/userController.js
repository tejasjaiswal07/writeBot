const User = require('../models/User');
const subscriptionService = require('../services/subscriptionService');
const { ValidationError } = require('../utils/errors');

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptionDetails = async (req, res, next) => {
  try {
    const details = await subscriptionService.getSubscriptionDetails(req.user._id);
    res.json(details);
  } catch (error) {
    next(error);
  }
};

exports.upgradeSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['pro', 'enterprise'].includes(plan)) {
      throw new ValidationError('Invalid subscription plan');
    }

    const subscription = await subscriptionService.updateSubscription(req.user._id, plan);
    res.json({ message: 'Subscription upgraded successfully', subscription });
  } catch (error) {
    next(error);
  }
};