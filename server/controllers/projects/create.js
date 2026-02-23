const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createProject } = require("../../services/projects");
const { validateCreateProject } = require("../../validator/project");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateProject(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createProject(value);
  return sendSuccess(res, 201, "Project created", result);
});
