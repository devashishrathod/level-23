const { asyncWrapper, sendSuccess } = require("../../utils");
const { getProperty } = require("../../services/properties");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getProperty(req.params.id);
  return sendSuccess(res, 200, "Property fetched", result);
});
