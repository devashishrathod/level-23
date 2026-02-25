const { asyncWrapper, sendSuccess } = require("../../utils");
const { getCostSheet } = require("../../services/costSheets");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getCostSheet(req.params.id);
  return sendSuccess(res, 200, "Cost sheet fetched", result);
});
