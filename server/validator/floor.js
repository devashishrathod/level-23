const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateFloor = (data) => {
  const schema = Joi.object({
    towerId: objectId().required(),
    projectId: objectId().optional(),
    name: Joi.string().allow("").max(150).optional(),
    number: Joi.number().integer().min(0).required(),
    description: Joi.string().allow("").max(1000).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateFloor = (data) => {
  const schema = Joi.object({
    towerId: objectId().optional(),
    projectId: objectId().optional(),
    name: Joi.string().allow("").max(150).optional(),
    number: Joi.number().integer().min(0).optional(),
    description: Joi.string().allow("").max(1000).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllFloorQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectId: objectId().optional(),
    towerId: objectId().optional(),
    number: Joi.number().integer().min(0).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "number", "totalUnits").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
