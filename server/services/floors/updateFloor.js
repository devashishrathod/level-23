const Floor = require("../../models/Floor");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
  recalculateFloorCounts,
} = require("../../helpers/projectManagement");

exports.updateFloor = async (id, payload) => {
  validateObjectId(id, "Floor Id");

  const floor = await Floor.findById(id);
  if (!floor || floor.isDeleted) throwError(404, "Floor not found");

  const prevProjectId = floor.projectId?.toString();
  const prevTowerId = floor.towerId?.toString();

  payload = payload || {};
  let { projectId, towerId, name, number, description, isActive } = payload;

  if (projectId && projectId.toString() !== prevProjectId) {
    throwError(
      400,
      "Project cannot be changed directly. Change towerId within the same project.",
    );
  }

  if (towerId && towerId.toString() !== prevTowerId) {
    // tower change is allowed only inside same project
    const tower = await Tower.findOne({ _id: towerId, isDeleted: false });
    if (!tower) throwError(404, "Tower not found");
    if (tower.projectId.toString() !== prevProjectId) {
      throwError(400, "Tower must belong to the same project");
    }
    floor.towerId = towerId;
  }

  // projectId is derived from the tower/project relationship; keep existing value

  if (typeof name !== "undefined") floor.name = name?.toLowerCase();
  if (typeof number !== "undefined") floor.number = Number(number);
  if (typeof description !== "undefined")
    floor.description = description?.toLowerCase();
  if (typeof isActive !== "undefined") floor.isActive = isActive;

  floor.updatedAt = new Date();
  try {
    await floor.save();
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Floor name/number already exists in this tower");
    }
    throw err;
  }

  await recalculateFloorCounts(floor._id);

  await Promise.all([
    recalculateTowerCounts(floor.towerId),
    recalculateProjectCounts(floor.projectId),
  ]);

  if (prevTowerId && prevTowerId !== floor.towerId.toString()) {
    await recalculateTowerCounts(prevTowerId);
  }
  if (prevProjectId && prevProjectId !== floor.projectId.toString()) {
    await recalculateProjectCounts(prevProjectId);
  }

  return floor;
};
