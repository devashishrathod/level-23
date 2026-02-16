const Property = require("../../models/Property");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");

exports.updateProperty = async (id, payload) => {
  validateObjectId(id, "Property Id");

  const result = await Property.findById(id);
  if (!result || result.isDeleted) throwError(404, "Property not found");

  const {
    categoryId,
    projectName,
    towerBlock,
    unitNumber,
    floor,
    areaSqFt,
    pricePerSqFt,
    isActive,
  } = payload;

  if (typeof isActive !== "undefined") result.isActive = !result.isActive;

  if (categoryId && categoryId.toString() !== result.categoryId?.toString()) {
    const category = await Category.findOne({ _id: categoryId, isDeleted: false });
    if (!category) throwError(404, "Category not found");
    result.categoryId = categoryId;
  }

  if (projectName) result.projectName = projectName?.toLowerCase();
  if (typeof towerBlock !== "undefined") result.towerBlock = towerBlock?.toLowerCase();
  if (typeof unitNumber !== "undefined") result.unitNumber = unitNumber?.toLowerCase();
  if (typeof floor !== "undefined") result.floor = floor;
  if (typeof areaSqFt !== "undefined") result.areaSqFt = Number(areaSqFt);
  if (typeof pricePerSqFt !== "undefined") result.pricePerSqFt = Number(pricePerSqFt);

  result.updatedAt = new Date();
  await result.save();
  return result;
};
