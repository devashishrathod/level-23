const mongoose = require("mongoose");
const { projectField } = require("./validObjectId");

const towerSchema = new mongoose.Schema(
  {
    projectId: { ...projectField, required: true },
    name: { type: String, required: true, trim: true },
    number: { type: String, trim: true },
    description: { type: String, trim: true },
    totalFloors: { type: Number, default: 0 },
    totalUnits: { type: Number, default: 0 },
    noOfSoldUnits: { type: Number, default: 0 },
    noOfReservedUnits: { type: Number, default: 0 },
    noOfAvailableUnits: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

towerSchema.index(
  { projectId: 1, name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

towerSchema.index(
  { projectId: 1, number: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { isDeleted: false, number: { $type: "string" } },
  },
);

module.exports = mongoose.model("Tower", towerSchema);
