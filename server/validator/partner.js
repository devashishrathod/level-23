const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { PARTNER_TYPES, PARTNER_STATUS } = require("../constants");

exports.validateCreatePartner = (data) => {
  const schema = Joi.object({
    userId: objectId().required(),
    companyName: Joi.string().min(2).max(150).required(),
    type: Joi.string()
      .valid(
        PARTNER_TYPES.BROKER,
        PARTNER_TYPES.AGENT,
        PARTNER_TYPES.CONSULTANT,
        PARTNER_TYPES.BUILDER
      )
      .required(),
    commissionPercent: Joi.number().min(0).max(100).required(),
    address: Joi.string().allow("").max(500).optional(),
    city: Joi.string().allow("").max(80).optional(),
    state: Joi.string().allow("").max(80).optional(),
    notes: Joi.string().allow("").max(800).optional(),
    status: Joi.string()
      .valid(
        PARTNER_STATUS.ACTIVE,
        PARTNER_STATUS.INACTIVE,
        PARTNER_STATUS.PENDING
      )
      .optional(),
    projectsCount: Joi.number().integer().min(0).optional(),
    revenue: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdatePartner = (data) => {
  const schema = Joi.object({
    companyName: Joi.string().min(2).max(150).optional(),
    type: Joi.string()
      .valid(
        PARTNER_TYPES.BROKER,
        PARTNER_TYPES.AGENT,
        PARTNER_TYPES.CONSULTANT,
        PARTNER_TYPES.BUILDER
      )
      .optional(),
    commissionPercent: Joi.number().min(0).max(100).optional(),
    address: Joi.string().allow("").max(500).optional(),
    city: Joi.string().allow("").max(80).optional(),
    state: Joi.string().allow("").max(80).optional(),
    notes: Joi.string().allow("").max(800).optional(),
    status: Joi.string()
      .valid(
        PARTNER_STATUS.ACTIVE,
        PARTNER_STATUS.INACTIVE,
        PARTNER_STATUS.PENDING
      )
      .optional(),
    projectsCount: Joi.number().integer().min(0).optional(),
    revenue: Joi.number().min(0).optional(),
    isActive: Joi.boolean().optional(),

    // user fields to sync
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllPartnerQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    type: Joi.string()
      .valid(
        PARTNER_TYPES.BROKER,
        PARTNER_TYPES.AGENT,
        PARTNER_TYPES.CONSULTANT,
        PARTNER_TYPES.BUILDER
      )
      .optional(),
    status: Joi.string()
      .valid(
        PARTNER_STATUS.ACTIVE,
        PARTNER_STATUS.INACTIVE,
        PARTNER_STATUS.PENDING
      )
      .optional(),
    userId: objectId().optional(),
    companyName: Joi.string().optional(),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    mobile: Joi.string().optional(),
    minRevenue: Joi.number().min(0).optional(),
    maxRevenue: Joi.number().min(0).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "revenue", "projectsCount").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
