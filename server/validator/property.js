const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateProperty = (data) => {
  const createSchema = Joi.object({
    categoryId: objectId().required().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    projectName: Joi.string().min(2).max(150).required(),
    towerBlock: Joi.string().allow("").max(80).optional(),
    unitNumber: Joi.string().allow("").max(80).optional(),
    floor: Joi.number().integer().optional(),
    areaSqFt: Joi.number().min(0).optional(),
    pricePerSqFt: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateProperty = (payload) => {
  const updateSchema = Joi.object({
    categoryId: objectId().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    projectName: Joi.string().min(2).max(150).optional(),
    towerBlock: Joi.string().allow("").max(80).optional(),
    unitNumber: Joi.string().allow("").max(80).optional(),
    floor: Joi.number().integer().optional(),
    areaSqFt: Joi.number().min(0).optional(),
    pricePerSqFt: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return updateSchema.validate(payload, { abortEarly: false });
};

exports.validateGetAllPropertyQuery = (payload) => {
  const getAllQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    projectName: Joi.string().optional(),
    towerBlock: Joi.string().optional(),
    unitNumber: Joi.string().optional(),
    categoryId: objectId().optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    minTotalPrice: Joi.number().min(0).optional(),
    maxTotalPrice: Joi.number().min(0).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "totalPrice").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return getAllQuerySchema.validate(payload, { abortEarly: false });
};
