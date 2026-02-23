const Tower = require("../../models/Tower");
const Project = require("../../models/Project");
const { throwError } = require("../../utils");
const { recalculateProjectCounts } = require("../../helpers/projectManagement");

exports.createTower = async (payload) => {
  let { projectId, name, number, description, isActive } = payload;

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project) throwError(404, "Project not found");

  name = name?.toLowerCase();
  number = number?.toLowerCase();
  description = description?.toLowerCase();

  const exists = await Tower.findOne({ projectId, name, isDeleted: false });
  if (exists) throwError(400, "Tower already exists with this name in this project");

  const tower = await Tower.create({
    projectId,
    name,
    number,
    description,
    isActive,
  });

  await recalculateProjectCounts(projectId);

  return tower;
};
