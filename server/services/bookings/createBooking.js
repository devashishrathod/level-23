const Booking = require("../../models/Booking");
const { generateBookingNo } = require("../../helpers/booking");

exports.createBooking = async (payload) => {
  const { type, bookingDate } = payload;

  const bookingNo = generateBookingNo();

  const result = await Booking.create({
    bookingNo,
    type: type?.toLowerCase(),
    bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
  });

  return result;
};
