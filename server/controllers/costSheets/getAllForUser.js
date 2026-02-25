const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllCostSheets } = require("../../services/costSheets");
const { validateGetAllCostSheetQuery } = require("../../validator/costSheet");

exports.getAllForUser = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllCostSheetQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllCostSheets(value);
  return sendSuccess(res, 200, "Cost sheets fetched", result);
});
