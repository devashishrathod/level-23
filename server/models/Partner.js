const mongoose = require("mongoose");
const { userField } = require("./validObjectId");
const { PARTNER_TYPES, PARTNER_STATUS } = require("../constants");

const partnerSchema = new mongoose.Schema(
  {
    userId: { ...userField, required: true },
    companyName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(PARTNER_TYPES),
      required: true,
    },
    commissionPercent: { type: Number, default: 0 },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(PARTNER_STATUS),
      default: PARTNER_STATUS.PENDING,
    },
    projectsCount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

partnerSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

module.exports = mongoose.model("Partner", partnerSchema);
