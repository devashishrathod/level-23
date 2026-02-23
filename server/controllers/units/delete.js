const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteUnit } = require("../../services/units");

exports.deleteUnit = asyncWrapper(async (req, res) => {
  await deleteUnit(req.params.id);
  return sendSuccess(res, 200, "Unit deleted");
});
