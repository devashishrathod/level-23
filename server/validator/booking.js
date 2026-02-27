const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const {
  BOOKING_TYPES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
} = require("../constants");

exports.validateCreateBooking = (data) => {
  const createSchema = Joi.object({
    type: Joi.string()
      .valid(BOOKING_TYPES.NEW, BOOKING_TYPES.RESALE)
      .required(),
    bookingDate: Joi.date().iso().optional(),
  });
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateBookingPersonal = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(80).required(),
    lastName: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(6).max(20).required(),
    aadharNumber: Joi.string().allow("").max(30).optional(),
    panNumber: Joi.string().allow("").max(30).optional(),
    alternatePhone: Joi.string().allow("").max(20).optional(),
    address: Joi.string().allow("").max(500).optional(),
    city: Joi.string().allow("").max(80).optional(),
    state: Joi.string().allow("").max(80).optional(),
    pincode: Joi.string().allow("").max(12).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateBookingProperty = (data) => {
  const schema = Joi.object({
    unitId: objectId().required().messages({
      "any.invalid": "Invalid unitId format",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateBookingPayment = (data) => {
  const schema = Joi.object({
    bookingAmount: Joi.number().min(0).required(),
    paymentMethod: Joi.string()
      .valid(
        PAYMENT_METHODS.CHEQUE,
        PAYMENT_METHODS.RTGS_NEFT,
        PAYMENT_METHODS.CASH,
        PAYMENT_METHODS.UPI,
        PAYMENT_METHODS.DEBIT_CREDIT_CARD,
      )
      .required(),
    bankName: Joi.string().allow("").max(120).optional(),
    chequeNumber: Joi.string().allow("").max(60).optional(),
    notes: Joi.string().allow("").max(800).optional(),
    status: Joi.string()
      .valid(
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.PROCESSING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.REJECTED,
      )
      .optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateBookingStatus = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.PROCESSING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.REJECTED,
      )
      .required(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllBookingQuery = (payload) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    bookingNo: Joi.string().optional(),
    type: Joi.string()
      .valid(BOOKING_TYPES.NEW, BOOKING_TYPES.RESALE)
      .optional(),
    status: Joi.string()
      .valid(
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.PROCESSING,
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.REJECTED,
      )
      .optional(),
    paymentMethod: Joi.string()
      .valid(
        PAYMENT_METHODS.CHEQUE,
        PAYMENT_METHODS.RTGS_NEFT,
        PAYMENT_METHODS.CASH,
        PAYMENT_METHODS.UPI,
        PAYMENT_METHODS.DEBIT_CREDIT_CARD,
      )
      .optional(),
    propertyId: objectId().optional(),
    categoryId: objectId().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    pincode: Joi.string().optional(),
    bookingAmount: Joi.number().optional(),
    minBookingAmount: Joi.number().min(0).optional(),
    maxBookingAmount: Joi.number().min(0).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string()
      .valid("createdAt", "bookingAmount", "bookingDate")
      .optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(payload, { abortEarly: false });
};
