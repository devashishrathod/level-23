const mongoose = require("mongoose");
const { categoryField } = require("./validObjectId");

const propertySchema = new mongoose.Schema(
  {
    categoryId: { ...categoryField, required: true },
    projectName: { type: String, required: true, trim: true },
    towerBlock: { type: String, trim: true },
    unitNumber: { type: String, trim: true },
    floor: { type: Number },
    areaSqFt: { type: Number, default: 0 },
    pricePerSqFt: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

propertySchema.pre("save", function () {
  const area = Number(this.areaSqFt || 0);
  const rate = Number(this.pricePerSqFt || 0);
  this.totalPrice = area * rate;
});

module.exports = mongoose.model("Property", propertySchema);
