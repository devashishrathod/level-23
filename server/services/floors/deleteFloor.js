const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
  recalculateFloorCounts,
} = require("../../helpers/projectManagement");

exports.deleteFloor = async (id) => {
  validateObjectId(id, "Floor Id");

  const floor = await Floor.findById(id);
  if (!floor || floor.isDeleted) throwError(404, "Floor not found");

  const now = new Date();
  const { projectId, towerId } = floor;

  await Unit.updateMany(
    { floorId: id, isDeleted: false },
    { $set: { isDeleted: true, isActive: false, updatedAt: now } },
  );

  floor.isDeleted = true;
  floor.isActive = false;
  floor.updatedAt = now;
  await floor.save();

  await Promise.all([
    recalculateFloorCounts(id),
    recalculateTowerCounts(towerId),
    recalculateProjectCounts(projectId),
  ]);

  return;
};
