const { asyncWrapper, sendSuccess } = require("../../utils");
const { getAdminSetting } = require("../../services/adminSettings");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getAdminSetting();
  return sendSuccess(res, 200, "Admin setting fetched", result);
});
