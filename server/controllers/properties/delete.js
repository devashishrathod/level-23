const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteProperty } = require("../../services/properties");

exports.deleteProperty = asyncWrapper(async (req, res) => {
  await deleteProperty(req.params.id);
  return sendSuccess(res, 200, "Property deleted");
});
