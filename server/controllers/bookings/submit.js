const { asyncWrapper, sendSuccess } = require("../../utils");
const { submitBooking } = require("../../services/bookings");

exports.submit = asyncWrapper(async (req, res) => {
  const result = await submitBooking(req.params.id);
  return sendSuccess(res, 200, "Booking submitted", result);
});
