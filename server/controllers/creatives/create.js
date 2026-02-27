const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createCreative } = require("../../services/creatives");
const { validateCreateCreative } = require("../../validator/creatives");

exports.create = asyncWrapper(async (req, res) => {
  const { error } = validateCreateCreative(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const image = req.files?.image;
  if (!image) throwError(422, "Image is required");
  const creative = await createCreative(req.body, image);
  return sendSuccess(res, 201, "Creative created", creative);
});
