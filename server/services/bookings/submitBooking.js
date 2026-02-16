const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.submitBooking = async (id) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  result.isSubmitted = true;
  result.updatedAt = new Date();
  await result.save();

  return result;
};
