const Project = require("../../models/Project");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const { throwError, validateObjectId } = require("../../utils");

exports.updateProject = async (id, payload) => {
  validateObjectId(id, "Project Id");

  const project = await Project.findById(id);
  if (!project || project.isDeleted) throwError(404, "Project not found");

  payload = payload || {};

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

  if (name) project.name = name?.toLowerCase();
  if (typeof description !== "undefined")
    project.description = description?.toLowerCase();
  if (typeof developer !== "undefined")
    project.developer = developer?.toLowerCase();
  if (typeof reraNo !== "undefined") project.reraNo = reraNo?.toLowerCase();
  if (typeof completionDate !== "undefined")
    project.completionDate = completionDate;
  if (typeof isActive !== "undefined") project.isActive = isActive;

  const nextTypeId = categoryId || project.categoryId;

  if (categoryId) {
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category) throwError(404, "Category not found");
    project.categoryId = categoryId;
  }

  if (subCategoryId) {
    const subCategory = await SubCategory.findOne({
      _id: subCategoryId,
      categoryId: nextTypeId,
      isDeleted: false,
    });
    if (!subCategory)
      throwError(404, "SubCategory not found for selected category");
    project.subCategoryId = subCategoryId;
  }

  project.updatedAt = new Date();
  try {
    await project.save();
  } catch (err) {
    if (err?.code === 11000) {
      if (err?.keyPattern?.reraNo) {
        throwError(400, "RERA number already exists for another project");
      }
      throwError(400, "Duplicate project data");
    }
    throw err;
  }
  return project;
};
