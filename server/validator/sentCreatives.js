const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { SENT_CREATIVE_STATUS } = require("../constants");

const recipientSchema = Joi.object({
  partnerUserId: Joi.string().required().messages({
    "any.required": "Partner User Id is required",
    "string.empty": "Partner User Id is required",
  }),
});

exports.validateSendCreative = (data) => {
  const schema = Joi.object({
    creativeId: objectId().required().messages({
      "any.required": "Creative Id is required",
      "any.invalid": "Creative Id must be a valid id",
    }),
    partners: Joi.array().items(recipientSchema).min(1).required().messages({
      "any.required": "Partners are required",
      "array.min": "At least one partner is required",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllSentCreativesQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    creativeId: objectId().optional(),
    partnerUserId: objectId().optional(),
    status: Joi.string()
      .valid(...Object.values(SENT_CREATIVE_STATUS))
      .optional(),
    isSent: Joi.alternatives().try(Joi.string(), Joi.boolean()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });

  return schema.validate(query, { abortEarly: false });
};
