const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteCostSheet } = require("../../services/costSheets");

exports.deleteCostSheet = asyncWrapper(async (req, res) => {
  await deleteCostSheet(req.params.id);
  return sendSuccess(res, 200, "Cost sheet deleted", null);
});
