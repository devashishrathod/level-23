const Joi = require("joi");
const { RERA_TYPES } = require("../constants");

exports.validateCreateRera = (data) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(RERA_TYPES))
      .required()
      .messages({
        "any.required": "Type is required",
        "any.only": "Type must be one of rera/permission/brochure/terms",
      }),
    name: Joi.string().min(2).max(150).optional().allow("").messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    description: Joi.string().max(500).optional().allow("").messages({
      "string.max": "Description cannot exceed {#limit} characters",
    }),
    reraNo: Joi.string().trim().required().messages({
      "any.required": "RERA number is required",
      "string.empty": "RERA number is required",
    }),
    projectId: Joi.string().trim().required().messages({
      "any.required": "Project Id is required",
      "string.empty": "Project Id is required",
    }),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateRera = (data) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(RERA_TYPES))
      .optional()
      .messages({
        "any.only": "Type must be one of rera/permission/brochure/terms",
      }),
    name: Joi.string().min(2).max(150).optional().allow("").messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    description: Joi.string().max(500).optional().allow("").messages({
      "string.max": "Description cannot exceed {#limit} characters",
    }),
    reraNo: Joi.string().trim().optional(),
    projectId: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllReraQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectId: Joi.string().trim().optional(),
    type: Joi.string()
      .valid(...Object.values(RERA_TYPES))
      .optional()
      .messages({
        "any.only": "Type must be one of rera/permission/brochure/terms",
      }),
    reraNo: Joi.string().trim().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "reraNo", "name").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
