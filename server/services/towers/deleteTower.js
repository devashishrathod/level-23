const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
} = require("../../helpers/projectManagement");

exports.deleteTower = async (id) => {
  validateObjectId(id, "Tower Id");

  const tower = await Tower.findById(id);
  if (!tower || tower.isDeleted) throwError(404, "Tower not found");

  const now = new Date();
  const projectId = tower.projectId;

  await Promise.all([
    Unit.updateMany(
      { towerId: id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: now } },
    ),
    Floor.updateMany(
      { towerId: id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: now } },
    ),
  ]);

  tower.isDeleted = true;
  tower.isActive = false;
  tower.updatedAt = now;
  await tower.save();

  await Promise.all([
    recalculateTowerCounts(id),
    recalculateProjectCounts(projectId),
  ]);

  return;
};
