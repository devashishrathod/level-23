const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteInventory } = require("../../services/inventory");

exports.deleteInventory = asyncWrapper(async (req, res) => {
  await deleteInventory(req.params.id);
  return sendSuccess(res, 200, "Inventory deleted");
});
