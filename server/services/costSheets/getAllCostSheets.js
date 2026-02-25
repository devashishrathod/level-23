const mongoose = require("mongoose");
const CostSheet = require("../../models/CostSheet");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllCostSheets = async (query) => {
  let {
    page,
    limit,
    search,
    projectId,
    towerId,
    floorId,
    unitId,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;
  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;
  const match = { isDeleted: false };
  if (typeof isActive !== "undefined") {
    match.isActive = isActive === "true" || isActive === true;
  }
  if (projectId) {
    validateObjectId(projectId, "Project Id");
    match.projectId = new mongoose.Types.ObjectId(projectId);
  }
  if (towerId) {
    validateObjectId(towerId, "Tower Id");
    match.towerId = new mongoose.Types.ObjectId(towerId);
  }
  if (floorId) {
    validateObjectId(floorId, "Floor Id");
    match.floorId = new mongoose.Types.ObjectId(floorId);
  }
  if (unitId) {
    validateObjectId(unitId, "Unit Id");
    match.unitId = new mongoose.Types.ObjectId(unitId);
  }
  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      match.createdAt.$lte = d;
    }
  }
  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1 } }],
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "towers",
        localField: "towerId",
        foreignField: "_id",
        as: "tower",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { name: 1, number: 1 } },
        ],
      },
    },
    { $unwind: { path: "$tower", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "floors",
        localField: "floorId",
        foreignField: "_id",
        as: "floor",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { name: 1, number: 1 } },
        ],
      },
    },
    { $unwind: { path: "$floor", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "units",
        localField: "unitId",
        foreignField: "_id",
        as: "unit",
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $project: {
              name: 1,
              number: 1,
              status: 1,
              carpetArea: 1,
              saleableArea: 1,
              unitType: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: false } },
  ];
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { "project.name": { $regex: new RegExp(search, "i") } },
          { "tower.name": { $regex: new RegExp(search, "i") } },
          { "floor.name": { $regex: new RegExp(search, "i") } },
          { "unit.number": { $regex: new RegExp(search, "i") } },
        ],
      },
    });
  }
  pipeline.push({
    $project: {
      project: 1,
      tower: 1,
      floor: 1,
      unit: 1,
      basicRate: 1,
      development: 1,
      dgBackup: 1,
      recreation: 1,
      societyLegal: 1,
      floorRise: 1,
      otherCharges: 1,
      isActive: 1,
      createdAt: 1,
    },
  });
  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });
  return await pagination(CostSheet, pipeline, page, limit);
};
