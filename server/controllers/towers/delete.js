const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteTower } = require("../../services/towers");

exports.deleteTower = asyncWrapper(async (req, res) => {
  await deleteTower(req.params.id);
  return sendSuccess(res, 200, "Tower deleted");
});
