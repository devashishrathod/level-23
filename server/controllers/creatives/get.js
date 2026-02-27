const { asyncWrapper, sendSuccess } = require("../../utils");
const { getCreative } = require("../../services/creatives");

exports.get = asyncWrapper(async (req, res) => {
  const creative = await getCreative(req.params.id);
  return sendSuccess(res, 200, "Creative fetched", creative);
});
