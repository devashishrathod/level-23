const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteProject } = require("../../services/projects");

exports.deleteProject = asyncWrapper(async (req, res) => {
  await deleteProject(req.params.id);
  return sendSuccess(res, 200, "Project deleted");
});
