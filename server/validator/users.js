const Joi = require("joi");
const { ROLES } = require("../constants");

exports.validateUpdateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    address: Joi.string().allow("").max(300).messages({
      "string.max": "Address cannot exceed {#limit} characters",
    }),
    dob: Joi.date().iso().messages({
      "date.format":
        "Date of birth must be a valid date in ISO format (YYYY-MM-DD)",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please enter a valid email address",
    }),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).messages({
      "number.base": "Mobile number must be numeric",
      "number.min": "Mobile number must be 10 digits",
      "number.max": "Mobile number must be 10 digits",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllUserQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    role: Joi.string()
      .valid(...Object.values(ROLES))
      .optional(),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    mobile: Joi.alternatives().try(Joi.number(), Joi.string()).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string()
      .valid("createdAt", "name", "email", "mobile")
      .optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
