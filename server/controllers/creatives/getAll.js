const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllCreatives } = require("../../services/creatives");
const { validateGetAllCreativesQuery } = require("../../validator/creatives");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllCreativesQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllCreatives(value);
  return sendSuccess(res, 200, "Creative list fetched", result);
});
