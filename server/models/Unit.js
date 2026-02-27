const mongoose = require("mongoose");
const {
  projectField,
  towerField,
  floorField,
  userField,
  bookingField,
} = require("./validObjectId");
const { UNIT_STATUS, UNIT_TYPES, UNIT_FACING } = require("../constants");

const unitSchema = new mongoose.Schema(
  {
    projectId: { ...projectField, required: true },
    towerId: { ...towerField, required: true },
    floorId: { ...floorField, required: true },
    name: { type: String, trim: true },
    number: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    carpetArea: { type: Number },
    saleableArea: { type: Number },
    unitType: { type: String, enum: Object.values(UNIT_TYPES), required: true },
    facing: { type: String, enum: Object.values(UNIT_FACING) },
    status: {
      type: String,
      enum: Object.values(UNIT_STATUS),
      default: UNIT_STATUS.AVAILABLE,
    },
    soldByUserId: { ...userField },
    soldByName: { type: String, trim: true },
    holdByUserId: { ...userField },
    holdByName: { type: String, trim: true },
    isBooked: { type: Boolean, default: false },
    bookingId: { ...bookingField },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

unitSchema.index(
  { floorId: 1, number: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

unitSchema.index(
  { floorId: 1, name: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { isDeleted: false, name: { $type: "string" } },
  },
);

module.exports = mongoose.model("Unit", unitSchema);
