const { asyncWrapper, sendSuccess } = require("../../utils");
const { getFaq } = require("../../services/faqs");

exports.get = asyncWrapper(async (req, res) => {
  const faq = await getFaq(req.params.id);
  return sendSuccess(res, 200, "FAQ fetched", faq);
});
