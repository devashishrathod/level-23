const mongoose = require("mongoose");
const { categoryField } = require("./validObjectId");

const termAndConditionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    categoryId: categoryField,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Term&Condition", termAndConditionSchema);
