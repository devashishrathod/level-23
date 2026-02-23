const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateTower } = require("../../services/towers");
const { validateUpdateTower } = require("../../validator/tower");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateTower(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateTower(req.params.id, value);
  return sendSuccess(res, 200, "Tower updated", result);
});
