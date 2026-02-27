const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllSentCreatives } = require("../../services/sentCreatives");
const { validateGetAllSentCreativesQuery } = require("../../validator/sentCreatives");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllSentCreativesQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));

  const result = await getAllSentCreatives(value);
  return sendSuccess(res, 200, "Sent creatives list fetched", result);
});
