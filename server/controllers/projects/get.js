const { asyncWrapper, sendSuccess } = require("../../utils");
const { getProject } = require("../../services/projects");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getProject(req.params.id);
  return sendSuccess(res, 200, "Project fetched", result);
});
