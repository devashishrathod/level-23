const { asyncWrapper, sendSuccess } = require("../../utils");
const { getInventory } = require("../../services/inventory");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getInventory(req.params.id);
  return sendSuccess(res, 200, "Inventory fetched", result);
});
