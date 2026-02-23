const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllProjects } = require("../../services/projects");
const { validateGetAllProjectQuery } = require("../../validator/project");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllProjectQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllProjects(value);
  return sendSuccess(res, 200, "Projects fetched", result);
});
