const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateRera } = require("../../services/reras");
const { validateUpdateRera } = require("../../validator/rera");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateRera(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const file = req.files?.file;
  const result = await updateRera(req.params.id, value, file);
  return sendSuccess(res, 200, "RERA updated", result);
});
