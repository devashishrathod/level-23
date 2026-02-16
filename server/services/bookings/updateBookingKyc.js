const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, uploadPDF } = require("../uploads");

const uploadKycFile = async (file, fileNamePrefix) => {
  if (!file?.tempFilePath) return null;
  const name = file?.name || "";
  const isPdf = name.toLowerCase().endsWith(".pdf");
  if (isPdf) return await uploadPDF(file.tempFilePath, `${fileNamePrefix}.pdf`);
  return await uploadImage(file.tempFilePath);
};

exports.updateBookingKyc = async (id, files) => {
  validateObjectId(id, "Booking Id");

  const result = await Booking.findById(id);
  if (!result || result.isDeleted) throwError(404, "Booking not found");

  const bookingNo = result.bookingNo || id;

  const aadharFile = files?.aadhar;
  const panFile = files?.pan;
  const passportFile = files?.passport;

  const [aadharUrl, panUrl, passportPhotoUrl] = await Promise.all([
    uploadKycFile(aadharFile, `${bookingNo}_aadhar`),
    uploadKycFile(panFile, `${bookingNo}_pan`),
    passportFile?.tempFilePath ? uploadImage(passportFile.tempFilePath) : null,
  ]);

  if (!result.kyc) result.kyc = {};
  if (aadharUrl) result.kyc.aadharUrl = aadharUrl;
  if (panUrl) result.kyc.panUrl = panUrl;
  if (passportPhotoUrl) result.kyc.passportPhotoUrl = passportPhotoUrl;

  result.updatedAt = new Date();
  await result.save();

  return result;
};
