const CostSheet = require("../../models/CostSheet");
const { throwError, validateObjectId } = require("../../utils");

exports.updateCostSheet = async (id, payload) => {
  validateObjectId(id, "CostSheet Id");

  const costSheet = await CostSheet.findById(id);
  if (!costSheet || costSheet.isDeleted) throwError(404, "Cost sheet not found");

  payload = payload || {};

  const {
    basicRate,
    development,
    dgBackup,
    recreation,
    societyLegal,
    floorRise,
    otherCharges,
    isActive,
  } = payload;

  if (typeof basicRate !== "undefined") costSheet.basicRate = basicRate;
  if (typeof development !== "undefined") costSheet.development = development;
  if (typeof dgBackup !== "undefined") costSheet.dgBackup = dgBackup;
  if (typeof recreation !== "undefined") costSheet.recreation = recreation;
  if (typeof societyLegal !== "undefined") costSheet.societyLegal = societyLegal;
  if (typeof floorRise !== "undefined") costSheet.floorRise = floorRise;
  if (typeof otherCharges !== "undefined") costSheet.otherCharges = otherCharges;
  if (typeof isActive !== "undefined") costSheet.isActive = isActive;

  costSheet.updatedAt = new Date();
  await costSheet.save();

  return costSheet;
};
