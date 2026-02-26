const mongoose = require("mongoose");
const { unitField } = require("./validObjectId");
const { DEMAND_LETTER_PAYMENT_STATUS } = require("../constants");

const demandLetterSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      agreementDate: { type: Date, required: true },
      address: { type: String, required: true, trim: true },
    },
    property: {
      unitId: { ...unitField, required: true },
      letterDate: { type: Date, required: true },
      subjectLine: { type: String, required: true, trim: true },
    },
    totalConsideration: { type: Number, required: true, min: 0 },
    considerationBreakup: [
      {
        title: { type: String, required: true, trim: true },
        percentage: { type: Number, required: true, min: 0, max: 100 },
        amount: { type: Number, required: true, min: 0 },
      },
    ],
    gst: {
      sgstPercentage: { type: Number, required: true, min: 0, max: 100 },
      cgstPercentage: { type: Number, required: true, min: 0, max: 100 },
      sgstAmount: { type: Number, required: true, min: 0 },
      cgstAmount: { type: Number, required: true, min: 0 },
      totalGstAmount: { type: Number, required: true, min: 0 },
    },
    totalPayable: { type: Number, required: true, min: 0 },
    amountReceived: { type: Number, default: 0, min: 0 },
    dueAmount: { type: Number, default: 0, min: 0 },
    paymentStatus: {
      type: String,
      enum: Object.values(DEMAND_LETTER_PAYMENT_STATUS),
      default: DEMAND_LETTER_PAYMENT_STATUS.PENDING,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

demandLetterSchema.index(
  { "property.unitId": 1, "property.letterDate": 1, "property.subjectLine": 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
demandLetterSchema.index({ "property.unitId": 1, isDeleted: 1 });
demandLetterSchema.index({ paymentStatus: 1, isDeleted: 1 });
demandLetterSchema.index({ "property.letterDate": 1, isDeleted: 1 });

module.exports = mongoose.model("DemandLetter", demandLetterSchema);
