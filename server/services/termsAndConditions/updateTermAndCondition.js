const TermAndCondition = require("../../models/Terms&Condition");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");

exports.updateTermAndCondition = async (id, payload) => {
  validateObjectId(id, "TermAndCondition Id");
  const result = await TermAndCondition.findById(id);
  if (!result || result.isDeleted) {
    throwError(404, "Term and condition not found");
  }
  let { title, description, categoryId, isActive } = payload;

  if (typeof isActive !== "undefined") result.isActive = !result.isActive;

  // Handle categoryId change
  if (categoryId && categoryId.toString() !== result.categoryId.toString()) {
    // Check if category exists and is not deleted
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category) {
      throwError(404, "Category not found");
    }

    // Check if title already exists in the target category
    const existingInTargetCategory = await TermAndCondition.findOne({
      _id: { $ne: id },
      title: result.title,
      categoryId: categoryId,
      isDeleted: false,
    });
    if (existingInTargetCategory) {
      throwError(
        409,
        `A term and condition with title "${result.title}" already exists in the target category`,
      );
    }

    result.categoryId = categoryId;
  }

  // Handle title change
  if (title && title.toLowerCase() !== result.title) {
    const normalizedTitle = title.toLowerCase();

    // Check if title already exists in the current (or updated) category
    const existingWithTitle = await TermAndCondition.findOne({
      _id: { $ne: id },
      title: normalizedTitle,
      categoryId: result.categoryId,
      isDeleted: false,
    });
    if (existingWithTitle) {
      throwError(
        409,
        `A term and condition with title "${title}" already exists in this category`,
      );
    }

    result.title = normalizedTitle;
  }

  if (description) result.description = description?.toLowerCase();
  result.updatedAt = new Date();
  await result.save();
  return result;
};
