const { asyncWrapper, sendSuccess } = require("../../utils");
const { getRera } = require("../../services/reras");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getRera(req.params.id);
  return sendSuccess(res, 200, "RERA fetched", result);
});
