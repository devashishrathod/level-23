const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllProperties } = require("../../services/properties");
const { validateGetAllPropertyQuery } = require("../../validator/property");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllPropertyQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllProperties(value);
  return sendSuccess(res, 200, "Properties fetched", result);
});
