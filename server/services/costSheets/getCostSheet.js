const mongoose = require("mongoose");
const CostSheet = require("../../models/CostSheet");
const { throwError, validateObjectId } = require("../../utils");

exports.getCostSheet = async (id) => {
  validateObjectId(id, "CostSheet Id");

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
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
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, number: 1 } }],
      },
    },
    { $unwind: { path: "$tower", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "floors",
        localField: "floorId",
        foreignField: "_id",
        as: "floor",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, number: 1 } }],
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
          { $project: { name: 1, number: 1, status: 1, carpetArea: 1, saleableArea: 1, unitType: 1 } },
        ],
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: false } },
    {
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
    },
  ];

  const [result] = await CostSheet.aggregate(pipeline);
  if (!result) throwError(404, "Cost sheet not found");
  return result;
};
