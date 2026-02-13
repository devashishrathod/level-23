const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateInventory } = require("../../services/inventory");
const { validateUpdateInventory } = require("../../validator/inventory");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateInventory(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateInventory(req.params.id, value);
  return sendSuccess(res, 200, "Inventory updated", result);
});
