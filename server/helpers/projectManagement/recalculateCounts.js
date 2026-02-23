const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { UNIT_STATUS } = require("../../constants");

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const countTowersByProject = async (projectId) => {
  const [r] = await Tower.aggregate([
    { $match: { projectId: toObjectId(projectId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

const countFloorsByProject = async (projectId) => {
  const [r] = await Floor.aggregate([
    { $match: { projectId: toObjectId(projectId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

const countUnitsByProject = async (projectId) => {
  const [r] = await Unit.aggregate([
    { $match: { projectId: toObjectId(projectId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

const unitStatusCounts = async (match) => {
  const [r] = await Unit.aggregate([
    { $match: { ...match, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalUnits: { $sum: 1 },
        noOfSoldUnits: {
          $sum: { $cond: [{ $eq: ["$status", UNIT_STATUS.SOLD] }, 1, 0] },
        },
        noOfReservedUnits: {
          $sum: { $cond: [{ $eq: ["$status", UNIT_STATUS.HOLD] }, 1, 0] },
        },
        noOfAvailableUnits: {
          $sum: { $cond: [{ $eq: ["$status", UNIT_STATUS.AVAILABLE] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    totalUnits: r?.totalUnits || 0,
    noOfSoldUnits: r?.noOfSoldUnits || 0,
    noOfReservedUnits: r?.noOfReservedUnits || 0,
    noOfAvailableUnits: r?.noOfAvailableUnits || 0,
  };
};

const countFloorsByTower = async (towerId) => {
  const [r] = await Floor.aggregate([
    { $match: { towerId: toObjectId(towerId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

const countUnitsByTower = async (towerId) => {
  const [r] = await Unit.aggregate([
    { $match: { towerId: toObjectId(towerId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

const countUnitsByFloor = async (floorId) => {
  const [r] = await Unit.aggregate([
    { $match: { floorId: toObjectId(floorId), isDeleted: false } },
    { $group: { _id: null, count: { $sum: 1 } } },
  ]);
  return r?.count || 0;
};

exports.recalculateProjectCounts = async (projectId) => {
  const [totalTowers, totalFloors, unitCounts] = await Promise.all([
    countTowersByProject(projectId),
    countFloorsByProject(projectId),
    unitStatusCounts({ projectId: toObjectId(projectId) }),
  ]);

  await Project.updateOne(
    { _id: projectId, isDeleted: false },
    {
      $set: {
        totalTowers,
        totalFloors,
        totalUnits: unitCounts.totalUnits,
        noOfSoldUnits: unitCounts.noOfSoldUnits,
        noOfReservedUnits: unitCounts.noOfReservedUnits,
        noOfAvailableUnits: unitCounts.noOfAvailableUnits,
      },
    },
  );

  return {
    totalTowers,
    totalFloors,
    ...unitCounts,
  };
};

exports.recalculateTowerCounts = async (towerId) => {
  const [totalFloors, unitCounts] = await Promise.all([
    countFloorsByTower(towerId),
    unitStatusCounts({ towerId: toObjectId(towerId) }),
  ]);

  await Tower.updateOne(
    { _id: towerId, isDeleted: false },
    {
      $set: {
        totalFloors,
        totalUnits: unitCounts.totalUnits,
        noOfSoldUnits: unitCounts.noOfSoldUnits,
        noOfReservedUnits: unitCounts.noOfReservedUnits,
        noOfAvailableUnits: unitCounts.noOfAvailableUnits,
      },
    },
  );

  return {
    totalFloors,
    ...unitCounts,
  };
};

exports.recalculateFloorCounts = async (floorId) => {
  const unitCounts = await unitStatusCounts({ floorId: toObjectId(floorId) });

  await Floor.updateOne(
    { _id: floorId, isDeleted: false },
    {
      $set: {
        totalUnits: unitCounts.totalUnits,
        noOfSoldUnits: unitCounts.noOfSoldUnits,
        noOfReservedUnits: unitCounts.noOfReservedUnits,
        noOfAvailableUnits: unitCounts.noOfAvailableUnits,
      },
    },
  );

  return {
    ...unitCounts,
  };
};
