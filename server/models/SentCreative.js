const mongoose = require("mongoose");
const { userField } = require("./validObjectId");
const { SENT_CREATIVE_STATUS } = require("../constants");

const sentCreativeSchema = new mongoose.Schema(
  {
    creativeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creative",
      required: true,
    },
    partnerUserId: { ...userField },
    partnerUserIdRaw: { type: String, trim: true },
    templateImage: { type: String, trim: true },
    isSent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(SENT_CREATIVE_STATUS),
      default: SENT_CREATIVE_STATUS.PENDING,
    },
    sentAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

sentCreativeSchema.index({ creativeId: 1, partnerUserId: 1, isDeleted: 1 });
sentCreativeSchema.index({ status: 1, isDeleted: 1, createdAt: 1 });

module.exports = mongoose.model("SentCreative", sentCreativeSchema);
