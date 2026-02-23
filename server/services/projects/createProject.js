const Project = require("../../models/Project");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const { throwError } = require("../../utils");

exports.createProject = async (payload) => {
  let {
    name,
    description,
    categoryId,
    subCategoryId,
    developer,
    reraNo,
    completionDate,
    isActive,
  } = payload;

  name = name?.toLowerCase();
  description = description?.toLowerCase();
  developer = developer?.toLowerCase();
  reraNo = reraNo?.toLowerCase();

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  const subCategory = await SubCategory.findOne({
    _id: subCategoryId,
    categoryId: categoryId,
    isDeleted: false,
  });
  if (!subCategory)
    throwError(404, "SubCategory not found for selected category");

  const exists = await Project.findOne({ name, isDeleted: false });
  if (exists) throwError(400, "Project already exists with this name");

  try {
    return await Project.create({
      name,
      description,
      categoryId,
      subCategoryId,
      developer,
      reraNo,
      completionDate,
      isActive,
    });
  } catch (err) {
    if (err?.code === 11000) {
      if (err?.keyPattern?.reraNo) {
        throwError(400, "RERA number already exists for another project");
      }
      throwError(400, "Duplicate project data");
    }
    throw err;
  }
};
