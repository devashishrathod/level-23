const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createUnit } = require("../../services/units");
const { validateCreateUnit } = require("../../validator/unit");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateUnit(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createUnit(value);
  return sendSuccess(res, 201, "Unit created", result);
});
