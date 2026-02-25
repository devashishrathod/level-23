const CostSheet = require("../../models/CostSheet");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteCostSheet = async (id) => {
  validateObjectId(id, "CostSheet Id");

  const costSheet = await CostSheet.findById(id);
  if (!costSheet || costSheet.isDeleted) throwError(404, "Cost sheet not found");

  costSheet.isDeleted = true;
  costSheet.isActive = false;
  costSheet.updatedAt = new Date();
  await costSheet.save();

  return;
};
