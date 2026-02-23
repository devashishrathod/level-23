const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createFloor } = require("../../services/floors");
const { validateCreateFloor } = require("../../validator/floor");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateFloor(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createFloor(value);
  return sendSuccess(res, 201, "Floor created", result);
});
