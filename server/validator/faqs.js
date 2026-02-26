const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateFaq = (data) => {
  const schema = Joi.object({
    categoryId: objectId().required().messages({
      "any.required": "Category Id is required",
      "any.invalid": "Category Id must be a valid id",
    }),
    title: Joi.string().trim().required().messages({
      "any.required": "Title is required",
      "string.empty": "Title is required",
    }),
    answer: Joi.string().trim().required().messages({
      "any.required": "Answer is required",
      "string.empty": "Answer is required",
    }),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateFaq = (data) => {
  const schema = Joi.object({
    categoryId: objectId().optional(),
    title: Joi.string().trim().optional(),
    answer: Joi.string().trim().optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllFaqsQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    categoryId: objectId().optional(),
    title: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "title").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
