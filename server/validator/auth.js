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
      .valid(ROLES.ADMIN, ROLES.STAFF, ROLES.USER, ROLES.PARTNER)
      .optional(),
    loginType: Joi.string()
      .valid(
        LOGIN_TYPES.EMAIL,
        LOGIN_TYPES.MOBILE,
        LOGIN_TYPES.GOOGLE,
        LOGIN_TYPES.PASSWORD,
        LOGIN_TYPES.OTHER,
      )
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
        .valid(
          PARTNER_TYPES.BROKER,
          PARTNER_TYPES.AGENT,
          PARTNER_TYPES.CONSULTANT,
          PARTNER_TYPES.BUILDER,
        )
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
        .valid(
          PARTNER_STATUS.ACTIVE,
          PARTNER_STATUS.INACTIVE,
          PARTNER_STATUS.PENDING,
        )
        .optional(),
      otherwise: Joi.forbidden(),
    }),
  });

  return schema.validate(payload, { abortEarly: false });
};
