const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { AuthorizationError } = require('../utils/errors');

const PLAN_LIMITS = {
  free: {
    analyze: 5,
    generate: 3,
    getSuggestions: 2,
    analyzeStyle: 1,
    generateOutline: 1
  },
  pro: {
    analyze: 50,
    generate: 30,
    getSuggestions: 20,
    analyzeStyle: 10,
    generateOutline: 10
  },
  enterprise: {
    analyze: Infinity,
    generate: Infinity,
    getSuggestions: Infinity,
    analyzeStyle: Infinity,
    generateOutline: Infinity
  }
};

exports.validateUserAction = async (user, action) => {
  const subscription = await Subscription.findOne({ user: user._id });
  if (!subscription) {
    throw new AuthorizationError('User has no active subscription');
  }

  const plan = subscription.plan;
  const limit = PLAN_LIMITS[plan][action];

  if (subscription.usage[action] >= limit) {
    throw new AuthorizationError(`You have reached your ${action} limit for this billing cycle`);
  }

  // Increment usage
  subscription.usage[action]++;
  await subscription.save();
};

exports.createSubscription = async (userId, plan) => {
  const subscription = new Subscription({
    user: userId,
    plan,
    usage: {
      analyze: 0,
      generate: 0,
      getSuggestions: 0,
      analyzeStyle: 0,
      generateOutline: 0
    }
  });

  await subscription.save();
  await User.findByIdAndUpdate(userId, { subscription: subscription._id });

  return subscription;
};

exports.updateSubscription = async (userId, newPlan) => {
  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new Error('No subscription found for user');
  }

  subscription.plan = newPlan;
  subscription.usage = {
    analyze: 0,
    generate: 0,
    getSuggestions: 0,
    analyzeStyle: 0,
    generateOutline: 0
  };

  await subscription.save();

  return subscription;
};

exports.getSubscriptionDetails = async (userId) => {
  const subscription = await Subscription.findOne({ user: userId });
  if (!subscription) {
    throw new Error('No subscription found for user');
  }

  const plan = subscription.plan;
  const limits = PLAN_LIMITS[plan];

  return {
    plan,
    usage: subscription.usage,
    limits
  };
};