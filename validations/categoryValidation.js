const Joi = require('joi');

const create = Joi.object({
  name: Joi.string().min(2).required(),
});

const update = Joi.object({
    name: Joi.string().min(2).required(),
  });

module.exports = { create, update };
