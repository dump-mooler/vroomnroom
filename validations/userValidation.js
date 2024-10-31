const Joi = require('joi');

const create = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'manager')
});

const update = Joi.object({
    newPassword: Joi.string().min(8).required()
});

module.exports = { create, update };
