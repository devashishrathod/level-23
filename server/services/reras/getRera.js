const mongoose = require("mongoose");
const Rera = require("../../models/Rera");
const { throwError, validateObjectId } = require("../../utils");

exports.getRera = async (id) => {
  validateObjectId(id, "Rera Id");

  const _id = new mongoose.Types.ObjectId(id);

  const docs = await Rera.aggregate([
    { $match: { _id, isDeleted: false } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
  ]);

  const doc = docs?.[0];
  if (!doc) throwError(404, "RERA not found");
  return doc;
};
