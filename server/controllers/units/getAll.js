const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllUnits } = require("../../services/units");
const { validateGetAllUnitQuery } = require("../../validator/unit");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllUnitQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllUnits(value);
  return sendSuccess(res, 200, "Units fetched", result);
});
