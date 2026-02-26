const Faq = require("../../models/Faq");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

const normalizeFilesArray = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  return [files];
};

exports.createFaq = async (payload, images) => {
  let { categoryId, title, answer, isActive } = payload;

  validateObjectId(categoryId, "Category Id");
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found!");

  title = title?.toLowerCase();

  const existing = await Faq.findOne({
    categoryId,
    title,
    isDeleted: false,
  });
  if (existing) {
    throwError(400, "FAQ with this title already exists for this category");
  }

  const imagesArr = normalizeFilesArray(images);
  const imageUrls = [];
  for (const img of imagesArr) {
    const url = await uploadImage(img.tempFilePath);
    imageUrls.push(url);
  }

  try {
    return await Faq.create({
      categoryId,
      title,
      answer,
      images: imageUrls,
      isActive,
    });
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "FAQ with this title already exists for this category");
    }
    throw err;
  }
};
