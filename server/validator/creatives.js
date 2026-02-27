const Joi = require("joi");

exports.validateCreateCreative = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(120).required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is required",
      "string.min": "Name has minimum {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    description: Joi.string().allow("").max(500).messages({
      "string.max": "Description cannot exceed {#limit} characters",
    }),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateCreative = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(120).optional(),
    description: Joi.string().allow("").max(500).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllCreativesQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
    isActive: Joi.alternatives().try(Joi.string(), Joi.boolean()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
