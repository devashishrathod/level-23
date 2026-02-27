const Creative = require("../../models/Creative");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteCreative = async (id) => {
  validateObjectId(id, "Creative Id");

  const creative = await Creative.findById(id);
  if (!creative || creative.isDeleted) throwError(404, "Creative not found");

  await deleteImage(creative?.image);
  creative.image = null;
  creative.isDeleted = true;
  creative.isActive = false;
  creative.updatedAt = new Date();
  await creative.save();
  return;
};
