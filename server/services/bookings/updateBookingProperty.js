const Booking = require("../../models/Booking");
const Property = require("../../models/Property");
const { throwError, validateObjectId } = require("../../utils");

exports.updateBookingProperty = async (id, payload) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  const { propertyId } = payload;
  validateObjectId(propertyId, "Property Id");

  const property = await Property.findOne({ _id: propertyId, isDeleted: false });
  if (!property) throwError(404, "Property not found");

  result.propertyId = propertyId;
  result.updatedAt = new Date();
  await result.save();

  return result;
};
