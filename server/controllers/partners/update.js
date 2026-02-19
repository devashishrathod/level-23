const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updatePartner } = require("../../services/partners");
const { validateUpdatePartner } = require("../../validator/partner");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdatePartner(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const result = await updatePartner(req.params.id, value, image);
  return sendSuccess(res, 200, "Partner updated", result);
});
