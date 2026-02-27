const { asyncWrapper, sendSuccess, throwError } = require("../../utils");
const { updateBookingKyc } = require("../../services/bookings");

exports.updateKyc = asyncWrapper(async (req, res) => {
  const files = {
    aadhar: req.files?.aadhar,
    pan: req.files?.pan,
    passport: req.files?.passport,
    clientSignature: req.files?.clientSignature,
    witnessSignature: req.files?.witnessSignature,
  };

  if (
    !files.aadhar &&
    !files.pan &&
    !files.passport &&
    !files.clientSignature &&
    !files.witnessSignature
  ) {
    throwError(422, "No KYC files provided");
  }

  const result = await updateBookingKyc(req.params.id, files);
  return sendSuccess(res, 200, "Booking KYC updated", result);
});
