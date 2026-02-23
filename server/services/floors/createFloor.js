const Floor = require("../../models/Floor");
const Tower = require("../../models/Tower");
const { throwError } = require("../../utils");
const {
  recalculateProjectCounts,
  recalculateTowerCounts,
} = require("../../helpers/projectManagement");

exports.createFloor = async (payload) => {
  let { projectId, towerId, name, number, description, isActive } = payload;

  const tower = await Tower.findOne({ _id: towerId, isDeleted: false });
  if (!tower) throwError(404, "Tower not found");

  // Priority: derive projectId from tower
  projectId = tower.projectId;

  name = name?.toLowerCase();
  description = description?.toLowerCase();

  const existsByNumber = await Floor.findOne({
    towerId,
    number,
    isDeleted: false,
  });
  if (existsByNumber)
    throwError(400, "Floor number already exists in this tower");

  if (name) {
    const existsByName = await Floor.findOne({
      towerId,
      name,
      isDeleted: false,
    });
    if (existsByName)
      throwError(400, "Floor name already exists in this tower");
  }

  let floor;
  try {
    floor = await Floor.create({
      projectId,
      towerId,
      name,
      number,
      description,
      isActive,
    });
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Floor already exists in this tower");
    }
    throw err;
  }

  await Promise.all([
    recalculateTowerCounts(towerId),
    recalculateProjectCounts(projectId),
  ]);

  return floor;
};
