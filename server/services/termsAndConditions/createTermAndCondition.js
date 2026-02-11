const TermAndCondition = require("../../models/Terms&Condition");
const Category = require("../../models/Category");
const { throwError } = require("../../utils");

exports.createTermAndCondition = async (payload, image) => {
  let { title, description, categoryId, isActive } = payload;
  title = title?.toLowerCase();
  description = description?.toLowerCase();
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) {
    throwError(404, "Category not found");
  }
  const existingTermAndCondition = await TermAndCondition.findOne({
    title,
    categoryId,
    isDeleted: false,
  });
  if (existingTermAndCondition) {
    throwError(
      400,
      "Term and condition already exist with this title in the same category",
    );
  }

  return await TermAndCondition.create({
    title,
    description,
    categoryId,
    isActive,
  });
};
