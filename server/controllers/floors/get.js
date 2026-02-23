const { asyncWrapper, sendSuccess } = require("../../utils");
const { getFloor } = require("../../services/floors");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getFloor(req.params.id);
  return sendSuccess(res, 200, "Floor fetched", result);
});
