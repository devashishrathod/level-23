const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateCreative } = require("../../services/creatives");
const { validateUpdateCreative } = require("../../validator/creatives");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateCreative(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const image = req.files?.image;
  const creative = await updateCreative(req.params.id, value, image);
  return sendSuccess(res, 200, "Creative updated", creative);
});
