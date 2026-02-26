const mongoose = require("mongoose");
const { projectField } = require("./validObjectId");
const { RERA_TYPES } = require("../constants");

const reraSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(RERA_TYPES),
      required: true,
      default: RERA_TYPES.RERA,
    },
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    reraNo: { type: String, required: true, trim: true },
    file: { type: String, required: true },
    projectId: { ...projectField, required: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

reraSchema.index(
  { projectId: 1, type: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

reraSchema.index({ reraNo: 1, isDeleted: 1 });

reraSchema.index({ projectId: 1, isDeleted: 1 });

module.exports = mongoose.model("Rera", reraSchema);
