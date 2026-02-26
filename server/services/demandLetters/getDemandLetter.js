const mongoose = require("mongoose");
const DemandLetter = require("../../models/DemandLetter");
const { throwError, validateObjectId } = require("../../utils");

exports.getDemandLetter = async (id) => {
  validateObjectId(id, "DemandLetter Id");
  const _id = new mongoose.Types.ObjectId(id);

  const docs = await DemandLetter.aggregate([
    { $match: { _id, isDeleted: false } },
    {
      $lookup: {
        from: "units",
        localField: "property.unitId",
        foreignField: "_id",
        as: "unit",
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "projects",
        localField: "unit.projectId",
        foreignField: "_id",
        as: "project",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1 } }],
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "towers",
        localField: "unit.towerId",
        foreignField: "_id",
        as: "tower",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, number: 1 } }],
      },
    },
    { $unwind: { path: "$tower", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "floors",
        localField: "unit.floorId",
        foreignField: "_id",
        as: "floor",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, number: 1 } }],
      },
    },
    { $unwind: { path: "$floor", preserveNullAndEmptyArrays: true } },
  ]);

  const doc = docs?.[0];
  if (!doc) throwError(404, "Demand letter not found");
  return doc;
};
