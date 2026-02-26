const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllReras } = require("../../services/reras");
const { validateGetAllReraQuery } = require("../../validator/rera");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllReraQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllReras(value);
  return sendSuccess(res, 200, "RERA list fetched", result);
});
