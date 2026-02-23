const mongoose = require("mongoose");
const { categoryField, subCategoryField } = require("./validObjectId");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    categoryId: { ...categoryField, required: true },
    subCategoryId: { ...subCategoryField, required: true },
    developer: { type: String, trim: true },
    reraNo: { type: String, trim: true },
    completionDate: { type: Date },
    totalTowers: { type: Number, default: 0 },
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

projectSchema.index(
  { reraNo: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

module.exports = mongoose.model("Project", projectSchema);
