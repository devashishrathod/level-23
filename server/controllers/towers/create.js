const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createTower } = require("../../services/towers");
const { validateCreateTower } = require("../../validator/tower");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateTower(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createTower(value);
  return sendSuccess(res, 201, "Tower created", result);
});
