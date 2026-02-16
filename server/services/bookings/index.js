const { createBooking } = require("./createBooking");
const { updateBookingPersonal } = require("./updateBookingPersonal");
const { updateBookingKyc } = require("./updateBookingKyc");
const { updateBookingProperty } = require("./updateBookingProperty");
const { updateBookingPayment } = require("./updateBookingPayment");
const { submitBooking } = require("./submitBooking");
const { getBooking } = require("./getBooking");
const { getAllBookings } = require("./getAllBookings");
const { updateBookingStatus } = require("./updateBookingStatus");
const { deleteBooking } = require("./deleteBooking");

module.exports = {
  createBooking,
  updateBookingPersonal,
  updateBookingKyc,
  updateBookingProperty,
  updateBookingPayment,
  submitBooking,
  getBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};
