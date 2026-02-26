const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteRera } = require("../../services/reras");

exports.deleteRera = asyncWrapper(async (req, res) => {
  await deleteRera(req.params.id);
  return sendSuccess(res, 200, "RERA deleted", null);
});
