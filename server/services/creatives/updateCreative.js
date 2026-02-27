const Creative = require("../../models/Creative");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateCreative = async (id, payload = 0, image) => {
  validateObjectId(id, "Creative Id");

  const creative = await Creative.findById(id);
  if (!creative || creative.isDeleted) throwError(404, "Creative not found");

  if (payload) {
    let { name, description, isActive } = payload;

    if (typeof isActive !== "undefined") creative.isActive = !creative.isActive;

    if (name) {
      name = name.toLowerCase();
      const existing = await Creative.findOne({
        _id: { $ne: id },
        name,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another creative exists with this name");
      creative.name = name;
    }

    if (description) creative.description = description?.toLowerCase() || "";
  }

  if (image) {
    if (creative.image) await deleteImage(creative.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    creative.image = imageUrl;
  }

  creative.updatedAt = new Date();
  await creative.save();
  return creative;
};
