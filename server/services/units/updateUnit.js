const Unit = require("../../models/Unit");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const User = require("../../models/User");
const { ROLES, UNIT_STATUS } = require("../../constants");
const { throwError, validateObjectId } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
  recalculateFloorCounts,
} = require("../../helpers/projectManagement");

const validateSalesUser = async (userId, label) => {
  if (!userId) throwError(400, `${label} userId is required`);
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throwError(404, `${label} user not found`);
  // if (![ROLES.SALESMAN].includes(user.role)) {
  //   throwError(400, `${label} user must be sales/salesman`);
  // }
  return user;
};

exports.updateUnit = async (id, payload) => {
  validateObjectId(id, "Unit Id");

  const unit = await Unit.findById(id);
  if (!unit || unit.isDeleted) throwError(404, "Unit not found");

  const prevProjectId = unit.projectId?.toString();
  const prevTowerId = unit.towerId?.toString();
  const prevFloorId = unit.floorId?.toString();

  payload = payload || {};
  let {
    projectId,
    towerId,
    floorId,
    name,
    number,
    description,
    carpetArea,
    saleableArea,
    unitType,
    facing,
    status,
    soldByUserId,
    soldByName,
    holdByUserId,
    holdByName,
    isActive,
  } = payload;

  // Parent changes are driven by floorId (priority) and must remain consistent.
  if (floorId && floorId.toString() !== prevFloorId) {
    const floor = await Floor.findOne({ _id: floorId, isDeleted: false });
    if (!floor) throwError(404, "Floor not found");

    // unit can move only inside same tower/project unless explicitly allowed later
    if (floor.towerId.toString() !== prevTowerId) {
      throwError(400, "Unit can be moved only within the same tower");
    }
    if (floor.projectId.toString() !== prevProjectId) {
      throwError(400, "Unit can be moved only within the same project");
    }

    unit.floorId = floorId;
    unit.towerId = floor.towerId;
    unit.projectId = floor.projectId;
  }

  // Reject direct towerId/projectId update (to avoid inconsistent links)
  if (towerId && towerId.toString() !== prevTowerId) {
    throwError(400, "Change floorId to update unit tower/project linkage");
  }
  if (projectId && projectId.toString() !== prevProjectId) {
    throwError(400, "Change floorId to update unit tower/project linkage");
  }

  if (typeof name !== "undefined") unit.name = name?.toLowerCase();
  if (typeof number !== "undefined") unit.number = number?.toLowerCase();
  if (typeof description !== "undefined")
    unit.description = description?.toLowerCase();
  if (typeof carpetArea !== "undefined") unit.carpetArea = carpetArea;
  if (typeof saleableArea !== "undefined") unit.saleableArea = saleableArea;
  if (typeof unitType !== "undefined") unit.unitType = unitType;
  if (typeof facing !== "undefined") unit.facing = facing;
  if (typeof isActive !== "undefined") unit.isActive = isActive;

  const nextStatus = status || unit.status;

  if (status) {
    unit.status = status;
  }

  if (nextStatus === UNIT_STATUS.SOLD) {
    const user = await validateSalesUser(
      soldByUserId || unit.soldByUserId,
      "Sold by",
    );
    unit.soldByUserId = soldByUserId || unit.soldByUserId;
    unit.soldByName = (
      soldByName ||
      unit.soldByName ||
      user?.name
    )?.toLowerCase();
    unit.holdByUserId = undefined;
    unit.holdByName = undefined;
  }

  if (nextStatus === UNIT_STATUS.HOLD) {
    const user = await validateSalesUser(
      holdByUserId || unit.holdByUserId,
      "Hold by",
    );
    unit.holdByUserId = holdByUserId || unit.holdByUserId;
    unit.holdByName = (
      holdByName ||
      unit.holdByName ||
      user?.name
    )?.toLowerCase();
    unit.soldByUserId = undefined;
    unit.soldByName = undefined;
  }

  if (nextStatus === UNIT_STATUS.AVAILABLE) {
    unit.soldByUserId = undefined;
    unit.soldByName = undefined;
    unit.holdByUserId = undefined;
    unit.holdByName = undefined;
  }

  unit.updatedAt = new Date();
  try {
    await unit.save();
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Unit number already exists in this floor");
    }
    throw err;
  }

  await Promise.all([
    recalculateFloorCounts(unit.floorId),
    recalculateTowerCounts(unit.towerId),
    recalculateProjectCounts(unit.projectId),
  ]);

  if (prevFloorId && prevFloorId !== unit.floorId.toString()) {
    await recalculateFloorCounts(prevFloorId);
  }
  if (prevTowerId && prevTowerId !== unit.towerId.toString()) {
    await recalculateTowerCounts(prevTowerId);
  }
  if (prevProjectId && prevProjectId !== unit.projectId.toString()) {
    await recalculateProjectCounts(prevProjectId);
  }

  return unit;
};
