const jwt = require('jsonwebtoken');
const config = require('../config/env');

exports.createToken = (user) => {
  return jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};