const mongoose = require("mongoose");
const { projectField, towerField } = require("./validObjectId");

const floorSchema = new mongoose.Schema(
  {
    projectId: { ...projectField, required: true },
    towerId: { ...towerField, required: true },
    name: { type: String, trim: true },
    number: { type: Number, required: true },
    description: { type: String, trim: true },
    totalUnits: { type: Number, default: 0 },
    noOfSoldUnits: { type: Number, default: 0 },
    noOfReservedUnits: { type: Number, default: 0 },
    noOfAvailableUnits: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

floorSchema.index(
  { towerId: 1, number: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

floorSchema.index(
  { towerId: 1, name: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { isDeleted: false, name: { $type: "string" } },
  },
);

module.exports = mongoose.model("Floor", floorSchema);
