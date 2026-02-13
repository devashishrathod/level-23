const mongoose = require("mongoose");
const { categoryField } = require("./validObjectId");
const { INVENTORY_STATUS } = require("../constants");

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { ...categoryField, required: true },
    quantity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(INVENTORY_STATUS),
      default: INVENTORY_STATUS.AVAILABLE,
    },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

inventorySchema.index(
  { name: 1, categoryId: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  },
);

module.exports = mongoose.model("Inventory", inventorySchema);
