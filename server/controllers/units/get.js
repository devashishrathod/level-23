const { asyncWrapper, sendSuccess } = require("../../utils");
const { getUnit } = require("../../services/units");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getUnit(req.params.id);
  return sendSuccess(res, 200, "Unit fetched", result);
});
