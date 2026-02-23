const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllTowers } = require("../../services/towers");
const { validateGetAllTowerQuery } = require("../../validator/tower");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllTowerQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllTowers(value);
  return sendSuccess(res, 200, "Towers fetched", result);
});
