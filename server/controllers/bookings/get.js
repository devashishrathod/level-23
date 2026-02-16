const { asyncWrapper, sendSuccess } = require("../../utils");
const { getBooking } = require("../../services/bookings");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getBooking(req.params.id);
  return sendSuccess(res, 200, "Booking fetched", result);
});
