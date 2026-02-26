const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateAdminSetting } = require("../../services/adminSettings");
const { validateUpdateAdminSetting } = require("../../validator/adminSetting");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateAdminSetting(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateAdminSetting(value);
  return sendSuccess(res, 200, "Admin setting updated", result);
});
