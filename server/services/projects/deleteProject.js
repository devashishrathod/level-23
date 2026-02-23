const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");
const { recalculateProjectCounts } = require("../../helpers/projectManagement");

exports.deleteProject = async (id) => {
  validateObjectId(id, "Project Id");

  const project = await Project.findById(id);
  if (!project || project.isDeleted) throwError(404, "Project not found");

  const now = new Date();

  await Promise.all([
    Unit.updateMany(
      { projectId: id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: now } },
    ),
    Floor.updateMany(
      { projectId: id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: now } },
    ),
    Tower.updateMany(
      { projectId: id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: now } },
    ),
  ]);

  project.isDeleted = true;
  project.isActive = false;
  project.updatedAt = now;
  await project.save();

  await recalculateProjectCounts(id);
  return;
};
