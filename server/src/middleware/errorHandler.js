const logger = require('../utils/logger');
const { ValidationError, AuthenticationError, AuthorizationError } = require('../utils/errors');

exports.errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({ error: err.message });
  }

  if (err instanceof AuthorizationError) {
    return res.status(403).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
};

exports.notFound = (req, res, next) => {
  res.status(404).json({ error: 'Not found' });
};