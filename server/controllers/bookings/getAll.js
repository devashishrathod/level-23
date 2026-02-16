const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllBookings } = require("../../services/bookings");
const { validateGetAllBookingQuery } = require("../../validator/booking");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllBookingQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllBookings(value);
  return sendSuccess(res, 200, "Bookings fetched", result);
});
