const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
  recalculateFloorCounts,
} = require("../../helpers/projectManagement");

exports.deleteUnit = async (id) => {
  validateObjectId(id, "Unit Id");

  const unit = await Unit.findById(id);
  if (!unit || unit.isDeleted) throwError(404, "Unit not found");

  const { projectId, towerId, floorId } = unit;

  unit.isDeleted = true;
  unit.isActive = false;
  unit.updatedAt = new Date();
  await unit.save();

  await Promise.all([
    recalculateFloorCounts(floorId),
    recalculateTowerCounts(towerId),
    recalculateProjectCounts(projectId),
  ]);

  return;
};
