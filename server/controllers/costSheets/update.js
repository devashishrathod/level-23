const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateCostSheet } = require("../../services/costSheets");
const { validateUpdateCostSheet } = require("../../validator/costSheet");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateCostSheet(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateCostSheet(req.params.id, value);
  return sendSuccess(res, 200, "Cost sheet updated", result);
});
