const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateUnit } = require("../../services/units");
const { validateUpdateUnit } = require("../../validator/unit");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateUnit(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateUnit(req.params.id, value);
  return sendSuccess(res, 200, "Unit updated", result);
});
