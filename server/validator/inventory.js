const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { INVENTORY_STATUS } = require("../constants");

exports.validateCreateInventory = (data) => {
  const createSchema = Joi.object({
    name: Joi.string().min(2).max(120).required().messages({
      "string.min": "Name has minimum {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    categoryId: objectId().required().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    quantity: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid(Object.values(INVENTORY_STATUS)).optional(),
    price: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateInventory = (payload) => {
  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(120).messages({
      "string.min": "Name has minimum {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    categoryId: objectId().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    quantity: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid(Object.values(INVENTORY_STATUS)).optional(),
    price: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return updateSchema.validate(payload, { abortEarly: false });
};

exports.validateGetAllInventoryQuery = (payload) => {
  const getAllQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
    categoryId: objectId().optional(),
    status: Joi.string().valid(Object.values(INVENTORY_STATUS)).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    minQuantity: Joi.number().integer().min(0).optional(),
    maxQuantity: Joi.number().integer().min(0).optional(),
    price: Joi.number().min(0).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("price", "createdAt", "quantity").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return getAllQuerySchema.validate(payload, { abortEarly: false });
};
