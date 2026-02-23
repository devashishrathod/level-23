const Tower = require("../../models/Tower");
const Project = require("../../models/Project");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
} = require("../../helpers/projectManagement");

exports.updateTower = async (id, payload) => {
  validateObjectId(id, "Tower Id");

  const tower = await Tower.findById(id);
  if (!tower || tower.isDeleted) throwError(404, "Tower not found");

  const prevProjectId = tower.projectId?.toString();

  let { projectId, name, number, description, isActive } = payload;

  if (projectId && projectId.toString() !== prevProjectId) {
    const project = await Project.findOne({ _id: projectId, isDeleted: false });
    if (!project) throwError(404, "Project not found");
    tower.projectId = projectId;
  }

  if (name) tower.name = name?.toLowerCase();
  if (typeof number !== "undefined") tower.number = number?.toLowerCase();
  if (typeof description !== "undefined") tower.description = description?.toLowerCase();
  if (typeof isActive !== "undefined") tower.isActive = isActive;

  tower.updatedAt = new Date();
  await tower.save();

  await recalculateTowerCounts(tower._id);

  // project totals may change if projectId changed
  await recalculateProjectCounts(tower.projectId);
  if (prevProjectId && prevProjectId !== tower.projectId.toString()) {
    await recalculateProjectCounts(prevProjectId);
  }

  return tower;
};
