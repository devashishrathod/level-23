const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateBookingStatus } = require("../../services/bookings");
const { validateUpdateBookingStatus } = require("../../validator/booking");

exports.updateStatus = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateBookingStatus(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateBookingStatus(req.params.id, value);
  return sendSuccess(res, 200, "Booking status updated", result);
});
