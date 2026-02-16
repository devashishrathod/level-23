const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateBookingPayment } = require("../../services/bookings");
const { validateUpdateBookingPayment } = require("../../validator/booking");

exports.updatePayment = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateBookingPayment(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateBookingPayment(req.params.id, value);
  return sendSuccess(res, 200, "Booking payment updated", result);
});
