const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteFaq } = require("../../services/faqs");

exports.deleteFaq = asyncWrapper(async (req, res) => {
  await deleteFaq(req.params.id);
  return sendSuccess(res, 200, "FAQ deleted", null);
});
