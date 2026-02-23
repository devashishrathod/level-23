const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateTower = (data) => {
  const schema = Joi.object({
    projectId: objectId().required(),
    name: Joi.string().min(1).max(150).required(),
    number: Joi.string().allow("").max(40).optional(),
    description: Joi.string().allow("").max(1000).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateTower = (data) => {
  const schema = Joi.object({
    projectId: objectId().optional(),
    name: Joi.string().min(1).max(150).optional(),
    number: Joi.string().allow("").max(40).optional(),
    description: Joi.string().allow("").max(1000).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllTowerQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectId: objectId().optional(),
    name: Joi.string().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "name", "totalUnits").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
