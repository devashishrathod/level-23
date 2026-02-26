const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateCostSheet = (data) => {
  const schema = Joi.object({
    projectId: objectId().optional(),
    towerId: objectId().optional(),
    floorId: objectId().optional(),
    unitId: objectId().optional(),
    otherCharges: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  })
    .xor("projectId", "towerId", "floorId", "unitId")
    .required();
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateCostSheet = (data) => {
  const schema = Joi.object({
    otherCharges: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllCostSheetQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectId: objectId().optional(),
    towerId: objectId().optional(),
    floorId: objectId().optional(),
    unitId: objectId().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "basicRate").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
