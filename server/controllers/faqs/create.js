const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createFaq } = require("../../services/faqs");
const { validateCreateFaq } = require("../../validator/faqs");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateFaq(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const images = req.files?.images;
  const faq = await createFaq(value, images);
  return sendSuccess(res, 201, "FAQ created", faq);
});
