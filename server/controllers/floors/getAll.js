const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllFloors } = require("../../services/floors");
const { validateGetAllFloorQuery } = require("../../validator/floor");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllFloorQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllFloors(value);
  return sendSuccess(res, 200, "Floors fetched", result);
});
