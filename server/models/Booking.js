const mongoose = require("mongoose");
const { propertyField } = require("./validObjectId");
const {
  BOOKING_TYPES,
  BOOKING_STATUS,
  PAYMENT_METHODS,
} = require("../constants");

const bookingSchema = new mongoose.Schema(
  {
    bookingNo: { type: String, trim: true },
    type: {
      type: String,
      enum: Object.values(BOOKING_TYPES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    bookingDate: { type: Date, default: Date.now },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    aadharNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    alternatePhone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    kyc: {
      aadharUrl: { type: String, trim: true },
      panUrl: { type: String, trim: true },
      passportPhotoUrl: { type: String, trim: true },
    },
    propertyId: { ...propertyField },
    bookingAmount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
    },
    bankName: { type: String, trim: true },
    chequeNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
    isSubmitted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

bookingSchema.index(
  { bookingNo: 1 },
  { unique: true, partialFilterExpression: { bookingNo: { $type: "string" } } },
);

module.exports = mongoose.model("Booking", bookingSchema);
