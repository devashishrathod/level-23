const Creative = require("../../models/Creative");
const { throwError } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createCreative = async (payload, image) => {
  let { name, description, isActive } = payload;
  name = name?.toLowerCase();
  description = description?.toLowerCase();

  if (!image) throwError(422, "Image is required");

  const existing = await Creative.findOne({ name, isDeleted: false });
  if (existing) throwError(400, "Creative already exist with this name");

  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  try {
    return await Creative.create({
      name,
      description,
      image: imageUrl,
      isActive,
    });
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Creative already exist with this name");
    }
    throw err;
  }
};
