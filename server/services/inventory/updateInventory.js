const Inventory = require("../../models/Inventory");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");

exports.updateInventory = async (id, payload) => {
  validateObjectId(id, "Inventory Id");

  const result = await Inventory.findById(id);
  if (!result || result.isDeleted) throwError(404, "Inventory not found");

  let { name, categoryId, quantity, status, price, isActive } = payload;

  if (typeof isActive !== "undefined") result.isActive = !result.isActive;

  if (categoryId && categoryId.toString() !== result.categoryId.toString()) {
    validateObjectId(categoryId, "Category Id");
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category) throwError(404, "Category not found");

    const existingInTargetCategory = await Inventory.findOne({
      _id: { $ne: id },
      name: result.name,
      categoryId,
      isDeleted: false,
    });

    if (existingInTargetCategory) {
      throwError(
        409,
        `Inventory with name "${result.name}" already exists in the target category`,
      );
    }

    result.categoryId = categoryId;
  }

  if (name && name.toLowerCase() !== result.name) {
    const normalizedName = name.toLowerCase();

    const existingWithName = await Inventory.findOne({
      _id: { $ne: id },
      name: normalizedName,
      categoryId: result.categoryId,
      isDeleted: false,
    });

    if (existingWithName) {
      throwError(
        409,
        `Inventory with name "${name}" already exists in this category`,
      );
    }

    result.name = normalizedName;
  }

  if (typeof quantity !== "undefined") result.quantity = Number(quantity);
  if (typeof price !== "undefined") result.price = Number(price);
  if (status) result.status = status?.toLowerCase();

  result.updatedAt = new Date();
  await result.save();
  return result;
};
