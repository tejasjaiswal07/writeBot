const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthenticationError } = require('../utils/errors');
const config = require('../config/env');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new AuthenticationError('Please authenticate'));
  }
};