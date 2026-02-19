const { asyncWrapper, sendSuccess } = require("../../utils");
const { deletePartner } = require("../../services/partners");

exports.deletePartner = asyncWrapper(async (req, res) => {
  await deletePartner(req.params.id);
  return sendSuccess(res, 200, "Partner deleted");
});
