const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body); // validate request body

    if (error) {
      // Send validation error response
      return res.status(400).json({ error: error.details[0].message });
    }
    
    next(); // Move to the next middleware/route handler if validation passes
  };
};

module.exports = validate;
