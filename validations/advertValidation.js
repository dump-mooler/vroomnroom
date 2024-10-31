const Joi = require('joi');

const advertSchema = Joi.object({
  category: Joi.number().required(),
});

module.exports = { advertSchema };
