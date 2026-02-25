const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllUsers } = require("../../services/users");
const { validateGetAllUserQuery } = require("../../validator/users");

exports.getAllUsers = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllUserQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllUsers(value);
  return sendSuccess(res, 200, "Users fetched", result);
});
