const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { DEMAND_LETTER_PAYMENT_STATUS } = require("../constants");

const percentageItem = Joi.object({
  title: Joi.string().trim().min(1).required().messages({
    "any.required": "Title is required",
    "string.empty": "Title is required",
  }),
  percentage: Joi.number().min(0).max(100).required().messages({
    "any.required": "Percentage is required",
  }),
});

exports.validateCreateDemandLetter = (data) => {
  const schema = Joi.object({
    customer: Joi.object({
      name: Joi.string().trim().required().messages({
        "any.required": "Customer name is required",
        "string.empty": "Customer name is required",
      }),
      agreementDate: Joi.date().required().messages({
        "any.required": "Agreement date is required",
      }),
      address: Joi.string().trim().required().messages({
        "any.required": "Customer address is required",
        "string.empty": "Customer address is required",
      }),
    }).required(),

    property: Joi.object({
      unitId: objectId().required().messages({
        "any.required": "Unit Id is required",
      }),
      letterDate: Joi.date().required().messages({
        "any.required": "Letter date is required",
      }),
      subjectLine: Joi.string().trim().required().messages({
        "any.required": "Subject line is required",
        "string.empty": "Subject line is required",
      }),
    }).required(),

    totalConsideration: Joi.number().min(0).required().messages({
      "any.required": "Total consideration is required",
    }),

    considerationBreakup: Joi.array().items(percentageItem).min(1).required().messages({
      "any.required": "Consideration breakup is required",
      "array.min": "At least one consideration item is required",
    }),

    gst: Joi.object({
      sgstPercentage: Joi.number().min(0).max(100).required().messages({
        "any.required": "SGST percentage is required",
      }),
      cgstPercentage: Joi.number().min(0).max(100).required().messages({
        "any.required": "CGST percentage is required",
      }),
    }).required(),

    amountReceived: Joi.number().min(0).optional(),

    paymentStatus: Joi.string()
      .valid(...Object.values(DEMAND_LETTER_PAYMENT_STATUS))
      .optional(),

    isActive: Joi.boolean().optional(),
  }).custom((value, helpers) => {
    const items = value.considerationBreakup || [];
    const sum = items.reduce((acc, i) => acc + Number(i.percentage || 0), 0);
    if (sum <= 0) return helpers.error("any.custom", { message: "Total percentage must be greater than 0" });
    if (sum > 100) return helpers.error("any.custom", { message: "Total percentage cannot exceed 100" });
    return value;
  }, "percentage-sum");

  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateDemandLetter = (data) => {
  const schema = Joi.object({
    customer: Joi.object({
      name: Joi.string().trim().optional(),
      agreementDate: Joi.date().optional(),
      address: Joi.string().trim().optional(),
    }).optional(),

    property: Joi.object({
      unitId: objectId().optional(),
      letterDate: Joi.date().optional(),
      subjectLine: Joi.string().trim().optional(),
    }).optional(),

    totalConsideration: Joi.number().min(0).optional(),

    considerationBreakup: Joi.array().items(percentageItem).min(1).optional(),

    gst: Joi.object({
      sgstPercentage: Joi.number().min(0).max(100).optional(),
      cgstPercentage: Joi.number().min(0).max(100).optional(),
    }).optional(),

    amountReceived: Joi.number().min(0).optional(),

    paymentStatus: Joi.string()
      .valid(...Object.values(DEMAND_LETTER_PAYMENT_STATUS))
      .optional(),

    isActive: Joi.boolean().optional(),
  }).custom((value, helpers) => {
    if (value.considerationBreakup) {
      const sum = value.considerationBreakup.reduce(
        (acc, i) => acc + Number(i.percentage || 0),
        0,
      );
      if (sum <= 0) return helpers.error("any.custom", { message: "Total percentage must be greater than 0" });
      if (sum > 100) return helpers.error("any.custom", { message: "Total percentage cannot exceed 100" });
    }
    return value;
  }, "percentage-sum");

  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllDemandLetterQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    unitId: objectId().optional(),
    paymentStatus: Joi.string()
      .valid(...Object.values(DEMAND_LETTER_PAYMENT_STATUS))
      .optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string().valid("createdAt", "totalPayable", "dueAmount").optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(query, { abortEarly: false });
};
