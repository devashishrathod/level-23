const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.updateBookingPayment = async (id, payload) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  Object.assign(result, payload);
  result.updatedAt = new Date();
  await result.save();

  return result;
};
