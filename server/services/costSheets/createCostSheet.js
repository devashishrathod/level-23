const CostSheet = require("../../models/CostSheet");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { throwError } = require("../../utils");
const { UNIT_STATUS } = require("../../constants");

exports.createCostSheet = async (payload) => {
  payload = payload || {};

  const {
    projectId,
    towerId,
    floorId,
    unitId,

    basicRate,
    development,
    dgBackup,
    recreation,
    societyLegal,
    floorRise,
    otherCharges,

    isActive,
  } = payload;

  const costFields = {
    basicRate,
    development,
    dgBackup,
    recreation,
    societyLegal,
    floorRise,
    otherCharges,
  };

  let units = [];

  if (unitId) {
    const unit = await Unit.findOne({ _id: unitId, isDeleted: false });
    if (!unit) throwError(404, "Unit not found");
    if (unit.status !== UNIT_STATUS.AVAILABLE) {
      throwError(400, "Cost sheet can be created only for available units");
    }
    units = [unit];
  } else if (floorId) {
    const floor = await Floor.findOne({ _id: floorId, isDeleted: false });
    if (!floor) throwError(404, "Floor not found");

    units = await Unit.find({
      floorId,
      isDeleted: false,
      status: UNIT_STATUS.AVAILABLE,
    });

    if (!units.length) {
      throwError(400, "No available units found in this floor");
    }
  } else if (towerId) {
    const tower = await Tower.findOne({ _id: towerId, isDeleted: false });
    if (!tower) throwError(404, "Tower not found");

    units = await Unit.find({
      towerId,
      isDeleted: false,
      status: UNIT_STATUS.AVAILABLE,
    });

    if (!units.length) {
      throwError(400, "No available units found in this tower");
    }
  } else if (projectId) {
    const project = await Project.findOne({ _id: projectId, isDeleted: false });
    if (!project) throwError(404, "Project not found");

    units = await Unit.find({
      projectId,
      isDeleted: false,
      status: UNIT_STATUS.AVAILABLE,
    });

    if (!units.length) {
      throwError(400, "No available units found in this project");
    }
  } else {
    throwError(422, "One of projectId/towerId/floorId/unitId is required");
  }

  const docs = units.map((u) => ({
    projectId: u.projectId,
    towerId: u.towerId,
    floorId: u.floorId,
    unitId: u._id,
    ...costFields,
    isActive,
  }));

  try {
    const created = await CostSheet.insertMany(docs, { ordered: false });
    return {
      createdCount: created.length,
      costSheets: created,
    };
  } catch (err) {
    if (err?.code === 11000) {
      throwError(400, "Cost sheet already exists for one or more units");
    }
    throw err;
  }
};
