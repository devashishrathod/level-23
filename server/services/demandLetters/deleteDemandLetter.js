const DemandLetter = require("../../models/DemandLetter");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteDemandLetter = async (id) => {
  validateObjectId(id, "DemandLetter Id");

  const doc = await DemandLetter.findById(id);
  if (!doc || doc.isDeleted) throwError(404, "Demand letter not found");

  doc.isDeleted = true;
  doc.isActive = false;
  doc.updatedAt = new Date();
  await doc.save();

  return;
};
