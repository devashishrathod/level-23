const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateBookingProperty } = require("../../services/bookings");
const { validateUpdateBookingProperty } = require("../../validator/booking");

exports.updateProperty = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateBookingProperty(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateBookingProperty(req.params.id, value);
  return sendSuccess(res, 200, "Booking property updated", result);
});
