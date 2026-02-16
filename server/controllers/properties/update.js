const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateProperty } = require("../../services/properties");
const { validateUpdateProperty } = require("../../validator/property");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateProperty(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateProperty(req.params.id, value);
  return sendSuccess(res, 200, "Property updated", result);
});
