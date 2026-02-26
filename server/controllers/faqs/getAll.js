const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllFaqs } = require("../../services/faqs");
const { validateGetAllFaqsQuery } = require("../../validator/faqs");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllFaqsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllFaqs(value);
  return sendSuccess(res, 200, "FAQ list fetched", result);
});
