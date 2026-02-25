const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createCostSheet } = require("../../services/costSheets");
const { validateCreateCostSheet } = require("../../validator/costSheet");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateCostSheet(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createCostSheet(value);
  return sendSuccess(res, 201, "Cost sheet created", result);
});
