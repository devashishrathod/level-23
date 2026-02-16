const Property = require("../../models/Property");
const Category = require("../../models/Category");
const { throwError } = require("../../utils");

exports.createProperty = async (payload) => {
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

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  const property = await Property.create({
    categoryId,
    projectName: projectName?.toLowerCase(),
    towerBlock: towerBlock?.toLowerCase(),
    unitNumber: unitNumber?.toLowerCase(),
    floor,
    areaSqFt,
    pricePerSqFt,
    isActive,
  });

  return property;
};
