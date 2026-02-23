const Unit = require("../../models/Unit");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const User = require("../../models/User");
const { ROLES, UNIT_STATUS } = require("../../constants");
const { throwError } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
  recalculateFloorCounts,
} = require("../../helpers/projectManagement");

const validateSalesUser = async (userId, label) => {
  if (!userId) throwError(400, `${label} userId is required`);
  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throwError(404, `${label} user not found`);
  if (![ROLES.SALESMAN].includes(user.role)) {
    throwError(400, `${label} user must be salesman`);
  }
  return user;
};

exports.createUnit = async (payload) => {
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

  const floor = await Floor.findOne({ _id: floorId, isDeleted: false });
  if (!floor) throwError(404, "Floor not found");

  // Priority: derive towerId/projectId from floor
  towerId = floor.towerId;
  projectId = floor.projectId;

  const tower = await Tower.findOne({ _id: towerId, isDeleted: false });
  if (!tower) throwError(404, "Tower not found");

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project) throwError(404, "Project not found");

  name = name?.toLowerCase();
  number = number?.toLowerCase();
  description = description?.toLowerCase();

  const existsByNumber = await Unit.findOne({
    floorId,
    number,
    isDeleted: false,
  });
  if (existsByNumber)
    throwError(400, "Unit number already exists in this floor");

  if (name) {
    const existsByName = await Unit.findOne({
      floorId,
      name,
      isDeleted: false,
    });
    if (existsByName) throwError(400, "Unit name already exists in this floor");
  }

  status = status || UNIT_STATUS.AVAILABLE;

  if (status === UNIT_STATUS.SOLD) {
    const user = await validateSalesUser(soldByUserId, "Sold by");
    soldByName = soldByName || user?.name;
    holdByUserId = undefined;
    holdByName = undefined;
  }

  if (status === UNIT_STATUS.HOLD) {
    const user = await validateSalesUser(holdByUserId, "Hold by");
    holdByName = holdByName || user?.name;
    soldByUserId = undefined;
    soldByName = undefined;
  }

  if (status === UNIT_STATUS.AVAILABLE) {
    soldByUserId = undefined;
    soldByName = undefined;
    holdByUserId = undefined;
    holdByName = undefined;
  }

  let unit;
  try {
    unit = await Unit.create({
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
      soldByName: soldByName?.toLowerCase(),
      holdByUserId,
      holdByName: holdByName?.toLowerCase(),
      isActive,
    });
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Unit already exists in this floor");
    }
    throw err;
  }

  await Promise.all([
    recalculateFloorCounts(floorId),
    recalculateTowerCounts(towerId),
    recalculateProjectCounts(projectId),
  ]);

  return unit;
};
