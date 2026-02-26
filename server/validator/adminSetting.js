const Joi = require("joi");

exports.validateCreateAdminSetting = (data) => {
  const schema = Joi.object({
    costSheetRates: Joi.object({
      basicRate: Joi.number().min(0).required(),
      development: Joi.number().min(0).required(),
      dgBackup: Joi.number().min(0).required(),
      recreation: Joi.number().min(0).required(),
      societyLegal: Joi.number().min(0).required(),
      floorRise: Joi.number().min(0).required(),
      otherCharges: Joi.number().min(0).optional(),
    }).required(),
    isActive: Joi.boolean().optional(),
  }).required();

  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateAdminSetting = (data) => {
  const schema = Joi.object({
    costSheetRates: Joi.object({
      basicRate: Joi.number().min(0).optional(),
      development: Joi.number().min(0).optional(),
      dgBackup: Joi.number().min(0).optional(),
      recreation: Joi.number().min(0).optional(),
      societyLegal: Joi.number().min(0).optional(),
      floorRise: Joi.number().min(0).optional(),
      otherCharges: Joi.number().min(0).optional(),
    }).optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data, { abortEarly: false });
};
