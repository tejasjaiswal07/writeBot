const { ValidationError } = require('../utils/errors');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    next(new ValidationError(errorMessage));
  } else {
    next();
  }
};

module.exports = validate;