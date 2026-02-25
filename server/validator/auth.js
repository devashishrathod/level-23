const Joi = require("joi");
const {
  ROLES,
  LOGIN_TYPES,
  PARTNER_TYPES,
  PARTNER_STATUS,
} = require("../constants");

exports.validateRegister = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    mobile: Joi.number().integer().min(1000000000).max(9999999999).optional(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(...Object.values(ROLES))
      .optional(),
    loginType: Joi.string()
      .valid(...Object.values(LOGIN_TYPES))
      .optional(),
    fcmToken: Joi.string().allow("").optional(),
    companyName: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string().min(2).max(150).required(),
      otherwise: Joi.forbidden(),
    }),
    type: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string()
        .valid(...Object.values(PARTNER_TYPES))
        .required(),
      otherwise: Joi.forbidden(),
    }),
    commissionPercent: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.number().min(0).max(100).required(),
      otherwise: Joi.forbidden(),
    }),
    address: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string().allow("").max(500).optional(),
      otherwise: Joi.forbidden(),
    }),
    city: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string().allow("").max(80).optional(),
      otherwise: Joi.forbidden(),
    }),
    state: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string().allow("").max(80).optional(),
      otherwise: Joi.forbidden(),
    }),
    notes: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string().allow("").max(800).optional(),
      otherwise: Joi.forbidden(),
    }),
    status: Joi.when("role", {
      is: ROLES.PARTNER,
      then: Joi.string()
        .valid(...Object.values(PARTNER_STATUS))
        .optional(),
      otherwise: Joi.forbidden(),
    }),
  });
  return schema.validate(payload, { abortEarly: false });
};
