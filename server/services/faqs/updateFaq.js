const Faq = require("../../models/Faq");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

const normalizeFilesArray = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  return [files];
};

exports.updateFaq = async (id, payload, images) => {
  validateObjectId(id, "FAQ Id");

  const faq = await Faq.findById(id);
  if (!faq || faq.isDeleted) throwError(404, "FAQ not found");

  payload = payload || {};
  let { categoryId, title, answer, isActive } = payload;

  if (categoryId) {
    validateObjectId(categoryId, "Category Id");
    const category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) throwError(404, "Category not found!");
    faq.categoryId = categoryId;
  }

  const nextCategoryId = categoryId || faq.categoryId;

  if (title) {
    title = title?.toLowerCase();
    const existing = await Faq.findOne({
      _id: { $ne: id },
      categoryId: nextCategoryId,
      title,
      isDeleted: false,
    });
    if (existing) {
      throwError(400, "Another FAQ exists with this title for same category");
    }
    faq.title = title;
  }

  if (answer) faq.answer = answer;

  if (typeof isActive !== "undefined") faq.isActive = !faq.isActive;

  const imagesArr = normalizeFilesArray(images);
  if (imagesArr.length > 0) {
    if (Array.isArray(faq.images) && faq.images.length > 0) {
      for (const url of faq.images) {
        await deleteImage(url);
      }
    }
    const imageUrls = [];
    for (const img of imagesArr) {
      const url = await uploadImage(img.tempFilePath);
      imageUrls.push(url);
    }
    faq.images = imageUrls;
  }

  faq.updatedAt = new Date();

  try {
    await faq.save();
    return faq;
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Another FAQ exists with this title for same category");
    }
    throw err;
  }
};
