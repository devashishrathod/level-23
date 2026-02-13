const Inventory = require("../../models/Inventory");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteInventory = async (id) => {
  validateObjectId(id, "Inventory Id");

  const result = await Inventory.findById(id);
  if (!result || result.isDeleted) throwError(404, "Inventory not found");

  result.isDeleted = true;
  result.isActive = false;
  result.updatedAt = new Date();
  await result.save();
  return;
};
