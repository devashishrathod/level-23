const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateFloor } = require("../../services/floors");
const { validateUpdateFloor } = require("../../validator/floor");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateFloor(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateFloor(req.params.id, value);
  return sendSuccess(res, 200, "Floor updated", result);
});
