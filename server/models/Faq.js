const mongoose = require("mongoose");
const { categoryField } = require("./validObjectId");

const faqSchema = new mongoose.Schema(
  {
    categoryId: { ...categoryField, required: true },
    title: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

faqSchema.index(
  { categoryId: 1, title: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

module.exports = mongoose.model("Faq", faqSchema);
