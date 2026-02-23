const { asyncWrapper, sendSuccess } = require("../../utils");
const { getTower } = require("../../services/towers");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getTower(req.params.id);
  return sendSuccess(res, 200, "Tower fetched", result);
});
