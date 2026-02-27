const Booking = require("../../models/Booking");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");

exports.updateBookingProperty = async (id, payload) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  const { unitId } = payload;
  validateObjectId(unitId, "Unit Id");

  const unit = await Unit.findOne({ _id: unitId, isDeleted: false });
  if (!unit) throwError(404, "Unit not found");
  if (unit.status !== "available") throwError(400, "Unit is not available");

  result.unitId = unitId;
  result.updatedAt = new Date();
  unit.isBooked = true;
  unit.bookingId = result._id;
  await unit.save();
  return await result.save();
};
