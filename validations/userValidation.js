const Joi = require('joi');

const create = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().min(4).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'manager'),
  phoneNumbers: Joi.string()
});

const updateUserValidation = Joi.object({
  fullName: Joi.string().required(),
  phoneNumbers: Joi.string()
});

const update = Joi.object({
    newPassword: Joi.string().min(8).required()
});

const updatePhoneNumbersValidation = Joi.object({ 
  phoneNumbers: Joi.string()
});

module.exports = { create, update, updatePhoneNumbersValidation, updateUserValidation };
