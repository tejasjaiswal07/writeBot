const User = require('../models/User');
const { createToken } = require('../utils/jwt');
const { ValidationError, AuthenticationError } = require('../utils/errors');
const subscriptionService = require('../services/subscriptionService');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ValidationError('Username or email already exists');
    }

    const user = new User({ username, email, password });
    await user.save();

    // Create a free subscription for the new user
    await subscriptionService.createSubscription(user._id, 'free');

    const token = createToken(user);
    res.status(201).json({ user: user.toJSON(), token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = createToken(user);
    res.json({ user: user.toJSON(), token });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json({ user: req.user.toJSON() });
};