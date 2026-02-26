const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createAdminSetting } = require("../../services/adminSettings");
const { validateCreateAdminSetting } = require("../../validator/adminSetting");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateAdminSetting(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createAdminSetting(value);
  return sendSuccess(res, 201, "Admin setting created", result);
});
