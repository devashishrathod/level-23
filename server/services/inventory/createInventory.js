const Inventory = require("../../models/Inventory");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");

exports.createInventory = async (payload) => {
  let { name, categoryId, quantity, status, price, isActive } = payload;
  name = name?.toLowerCase();
  validateObjectId(categoryId, "Category Id");
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  const existing = await Inventory.findOne({
    name,
    categoryId,
    isDeleted: false,
  });
  if (existing) {
    throwError(400, "Inventory already exist with this name in this category");
  }

  return await Inventory.create({
    name,
    categoryId,
    quantity,
    status,
    price,
    isActive,
  });
};
