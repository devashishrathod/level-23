const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createBooking } = require("../../services/bookings");
const { validateCreateBooking } = require("../../validator/booking");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateBooking(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createBooking(value);
  return sendSuccess(res, 201, "Booking created", result);
});
