const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createInventory } = require("../../services/inventory");
const { validateCreateInventory } = require("../../validator/inventory");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateInventory(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createInventory(value);
  return sendSuccess(res, 201, "Inventory created", result);
});
