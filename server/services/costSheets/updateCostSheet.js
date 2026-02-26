const CostSheet = require("../../models/CostSheet");
const { throwError, validateObjectId } = require("../../utils");

exports.updateCostSheet = async (id, payload) => {
  validateObjectId(id, "CostSheet Id");

  const costSheet = await CostSheet.findById(id);
  if (!costSheet || costSheet.isDeleted)
    throwError(404, "Cost sheet not found");

  payload = payload || {};

  const { isActive } = payload;

  if (typeof isActive !== "undefined") costSheet.isActive = isActive;

  if (typeof costSheet.total === "undefined" || costSheet.total === null) {
    costSheet.total =
      (costSheet.basicRate || 0) +
      (costSheet.development || 0) +
      (costSheet.dgBackup || 0) +
      (costSheet.recreation || 0) +
      (costSheet.societyLegal || 0) +
      (costSheet.floorRise || 0) +
      (costSheet.otherCharges || 0);
  }

  costSheet.updatedAt = new Date();
  await costSheet.save();

  return costSheet;
};
