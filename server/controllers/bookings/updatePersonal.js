const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateBookingPersonal } = require("../../services/bookings");
const { validateUpdateBookingPersonal } = require("../../validator/booking");

exports.updatePersonal = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateBookingPersonal(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateBookingPersonal(req.params.id, value);
  return sendSuccess(res, 200, "Booking personal details updated", result);
});
