const { asyncWrapper, sendSuccess } = require("../../utils");
const { getPartner } = require("../../services/partners");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getPartner(req.params.id);
  return sendSuccess(res, 200, "Partner fetched", result);
});
