const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteSentCreative } = require("../../services/sentCreatives");

exports.deleteSentCreative = asyncWrapper(async (req, res) => {
  await deleteSentCreative(req.params.id);
  return sendSuccess(res, 200, "Sent creative deleted", null);
});
