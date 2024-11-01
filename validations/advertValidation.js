const Joi = require("joi");

const attribute = Joi.object({
  name: Joi.string(),
  value: Joi.any(),
  data_type: Joi.string(),
  unit: Joi.string().optional(),
});

const create = Joi.object({
  description: Joi.string().required(),
  category: Joi.number().required(),
  price: Joi.number().required(),
  city: Joi.string().required(),
  title: Joi.string(),
  level: Joi.string().valid("bronze", "silver", "gold", "diamond").required(),
  media: Joi.array().items(Joi.string()),
  thumbnail: Joi.string(),
  attrs: Joi.array().items(attribute),
  isSold: Joi.boolean().optional()
});

const update = Joi.object({
  description: Joi.string().required(),
  category: Joi.number().required(),
  price: Joi.number().required(),
  city: Joi.string().required(),
  title: Joi.string(),
  level: Joi.string().valid("bronze", "silver", "gold", "diamond").required(),
  media: Joi.array().items(Joi.string()),
  thumbnail: Joi.string(),
  attrs: Joi.array().items(attribute),
});

module.exports = { create, update };
