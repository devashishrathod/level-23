const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteCreative } = require("../../services/creatives");

exports.deleteCreative = asyncWrapper(async (req, res) => {
  await deleteCreative(req.params.id);
  return sendSuccess(res, 200, "Creative deleted", null);
});
