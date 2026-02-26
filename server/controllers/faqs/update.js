const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateFaq } = require("../../services/faqs");
const { validateUpdateFaq } = require("../../validator/faqs");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateFaq(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const images = req.files?.images;
  const faq = await updateFaq(req.params.id, value, images);
  return sendSuccess(res, 200, "FAQ updated", faq);
});
