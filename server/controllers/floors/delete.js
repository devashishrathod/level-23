const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteFloor } = require("../../services/floors");

exports.deleteFloor = asyncWrapper(async (req, res) => {
  await deleteFloor(req.params.id);
  return sendSuccess(res, 200, "Floor deleted");
});
