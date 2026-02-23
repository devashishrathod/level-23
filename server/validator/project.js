const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    description: Joi.string().allow("").max(1000).optional(),
    categoryId: objectId().required(),
    subCategoryId: objectId().required(),
    developer: Joi.string().allow("").max(150).optional(),
    reraNo: Joi.string().allow("").max(80).optional(),
    completionDate: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(150).optional(),
    description: Joi.string().allow("").max(1000).optional(),
    categoryId: objectId().optional(),
    subCategoryId: objectId().optional(),
    developer: Joi.string().allow("").max(150).optional(),
    reraNo: Joi.string().allow("").max(80).optional(),
    completionDate: Joi.date().iso().optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllProjectQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
    developer: Joi.string().optional(),
    reraNo: Joi.string().optional(),
    categoryId: objectId().optional(),
    subCategoryId: objectId().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "name", "totalUnits").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
