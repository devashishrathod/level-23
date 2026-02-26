const mongoose = require("mongoose");

const adminSettingSchema = new mongoose.Schema(
  {
    costSheetRates: {
      basicRate: { type: Number, required: true, min: 0 },
      development: { type: Number, required: true, min: 0 },
      dgBackup: { type: Number, required: true, min: 0 },
      recreation: { type: Number, required: true, min: 0 },
      societyLegal: { type: Number, required: true, min: 0 },
      floorRise: { type: Number, required: true, min: 0 },
      otherCharges: { type: Number, default: 0, min: 0 },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

adminSettingSchema.index(
  { isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

module.exports = mongoose.model("AdminSetting", adminSettingSchema);
