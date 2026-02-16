const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createProperty } = require("../../services/properties");
const { validateCreateProperty } = require("../../validator/property");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateProperty(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createProperty(value);
  return sendSuccess(res, 201, "Property created", result);
});
