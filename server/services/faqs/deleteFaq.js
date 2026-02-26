const Faq = require("../../models/Faq");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteFaq = async (id) => {
  validateObjectId(id, "FAQ Id");

  const faq = await Faq.findById(id);
  if (!faq || faq.isDeleted) throwError(404, "FAQ not found");

  if (Array.isArray(faq.images) && faq.images.length > 0) {
    for (const url of faq.images) {
      await deleteImage(url);
    }
  }

  faq.images = [];
  faq.isDeleted = true;
  faq.isActive = false;
  faq.updatedAt = new Date();
  await faq.save();
  return;
};
