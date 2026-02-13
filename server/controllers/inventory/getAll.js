const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllInventory } = require("../../services/inventory");
const { validateGetAllInventoryQuery } = require("../../validator/inventory");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllInventoryQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllInventory(value);
  return sendSuccess(res, 200, "Inventory fetched", result);
});
