const SentCreative = require("../../models/SentCreative");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteSentCreative = async (id) => {
  validateObjectId(id, "SentCreative Id");

  const doc = await SentCreative.findById(id);
  if (!doc || doc.isDeleted) throwError(404, "Sent creative not found");

  if (doc.templateImage) await deleteImage(doc.templateImage);
  doc.templateImage = null;
  doc.isDeleted = true;
  doc.updatedAt = new Date();
  await doc.save();
  return;
};
