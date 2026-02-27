const { asyncWrapper, sendSuccess } = require("../../utils");
const { getSentCreative } = require("../../services/sentCreatives");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getSentCreative(req.params.id);
  return sendSuccess(res, 200, "Sent creative fetched", result);
});
