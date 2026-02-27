const Creative = require("../../models/Creative");
const { throwError, validateObjectId } = require("../../utils");

exports.getCreative = async (id) => {
  validateObjectId(id, "Creative Id");
  const creative = await Creative.findById(id);
  if (!creative || creative.isDeleted) throwError(404, "Creative not found");
  return creative;
};
