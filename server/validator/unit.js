const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { UNIT_STATUS, UNIT_TYPES, UNIT_FACING } = require("../constants");

exports.validateCreateUnit = (data) => {
  const schema = Joi.object({
    floorId: objectId().required(),
    towerId: objectId().optional(),
    projectId: objectId().optional(),
    name: Joi.string().allow("").max(150).optional(),
    number: Joi.string().min(1).max(40).required(),
    description: Joi.string().allow("").max(1000).optional(),
    carpetArea: Joi.number().min(0).required(),
    saleableArea: Joi.number().min(0).required(),
    unitType: Joi.string()
      .valid(...Object.values(UNIT_TYPES))
      .required(),
    facing: Joi.string()
      .valid(...Object.values(UNIT_FACING))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(UNIT_STATUS))
      .default(UNIT_STATUS.AVAILABLE),
    soldByUserId: objectId().optional(),
    soldByName: Joi.string().allow("").max(120).optional(),
    holdByUserId: objectId().optional(),
    holdByName: Joi.string().allow("").max(120).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateUnit = (data) => {
  const schema = Joi.object({
    floorId: objectId().optional(),
    towerId: objectId().optional(),
    projectId: objectId().optional(),
    name: Joi.string().allow("").max(150).optional(),
    number: Joi.string().min(1).max(40).optional(),
    description: Joi.string().allow("").max(1000).optional(),
    carpetArea: Joi.number().min(0).optional(),
    saleableArea: Joi.number().min(0).optional(),
    unitType: Joi.string()
      .valid(...Object.values(UNIT_TYPES))
      .optional(),
    facing: Joi.string()
      .valid(...Object.values(UNIT_FACING))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(UNIT_STATUS))
      .optional(),
    soldByUserId: objectId().optional(),
    soldByName: Joi.string().allow("").max(120).optional(),
    holdByUserId: objectId().optional(),
    holdByName: Joi.string().allow("").max(120).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllUnitQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectId: objectId().optional(),
    towerId: objectId().optional(),
    floorId: objectId().optional(),
    status: Joi.string()
      .valid(...Object.values(UNIT_STATUS))
      .optional(),
    unitType: Joi.string()
      .valid(...Object.values(UNIT_TYPES))
      .optional(),
    facing: Joi.string()
      .valid(...Object.values(UNIT_FACING))
      .optional(),
    number: Joi.string().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "number").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
