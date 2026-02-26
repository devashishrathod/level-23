const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createRera } = require("../../services/reras");
const { validateCreateRera } = require("../../validator/rera");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateRera(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const file = req.files?.file;
  const result = await createRera(value, file);
  return sendSuccess(res, 201, "RERA created", result);
});
