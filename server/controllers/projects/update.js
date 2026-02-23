const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateProject } = require("../../services/projects");
const { validateUpdateProject } = require("../../validator/project");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateProject(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateProject(req.params.id, value);
  return sendSuccess(res, 200, "Project updated", result);
});
