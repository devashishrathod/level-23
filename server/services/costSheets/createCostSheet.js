const CostSheet = require("../../models/CostSheet");
const AdminSetting = require("../../models/AdminSetting");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { throwError } = require("../../utils");
const { UNIT_STATUS } = require("../../constants");

const calculateCostFields = (saleableArea, rates) => {
  const area = Number(saleableArea);
  if (!area || Number.isNaN(area) || area <= 0) {
    throwError(400, "Unit saleable area is missing");
  }

  const basicRate = area * Number(rates.basicRate || 0);
  const development = area * Number(rates.development || 0);
  const dgBackup = area * Number(rates.dgBackup || 0);
  const recreation = area * Number(rates.recreation || 0);
  const societyLegal = area * Number(rates.societyLegal || 0);
  const floorRise = area * Number(rates.floorRise || 0);
  const otherCharges = Number(rates.otherCharges || 0);

  const total =
    basicRate +
    development +
    dgBackup +
    recreation +
    societyLegal +
    floorRise +
    otherCharges;

  return {
    basicRate,
    development,
    dgBackup,
    recreation,
    societyLegal,
    floorRise,
    otherCharges,
    total,
  };
};

exports.createCostSheet = async (payload) => {
  payload = payload || {};

  const { projectId, towerId, floorId, unitId, otherCharges, isActive } =
    payload;

  const setting = await AdminSetting.findOne({
    isDeleted: false,
    isActive: true,
  });
  if (!setting?.costSheetRates) {
    throwError(
      400,
      "Cost sheet rates are not configured. Please update admin settings",
    );
  }

  const rates = setting.costSheetRates;
  if (otherCharges) rates.otherCharges = otherCharges;
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
    ...calculateCostFields(u.saleableArea, rates),
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
