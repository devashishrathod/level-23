const mongoose = require("mongoose");
const {
  projectField,
  towerField,
  floorField,
  unitField,
} = require("./validObjectId");

const costSheetSchema = new mongoose.Schema(
  {
    projectId: { ...projectField, required: true },
    towerId: { ...towerField, required: true },
    floorId: { ...floorField, required: true },
    unitId: { ...unitField, required: true },

    basicRate: { type: Number, required: true, min: 0 },
    development: { type: Number, required: true, min: 0 },
    dgBackup: { type: Number, required: true, min: 0 },
    recreation: { type: Number, required: true, min: 0 },
    societyLegal: { type: Number, required: true, min: 0 },
    floorRise: { type: Number, required: true, min: 0 },

    otherCharges: { type: Number, required: true, min: 0 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

costSheetSchema.index(
  { unitId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

costSheetSchema.index({ projectId: 1, isDeleted: 1 });
costSheetSchema.index({ towerId: 1, isDeleted: 1 });
costSheetSchema.index({ floorId: 1, isDeleted: 1 });

module.exports = mongoose.model("CostSheet", costSheetSchema);
