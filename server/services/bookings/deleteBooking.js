const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteBooking = async (id) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  result.isDeleted = true;
  result.isActive = false;
  result.updatedAt = new Date();
  await result.save();
  return;
};
