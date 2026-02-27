const mongoose = require("mongoose");
const SentCreative = require("../../models/SentCreative");
const { throwError, validateObjectId } = require("../../utils");

exports.getSentCreative = async (id) => {
  validateObjectId(id, "SentCreative Id");
  const _id = new mongoose.Types.ObjectId(id);

  const docs = await SentCreative.aggregate([
    { $match: { _id, isDeleted: false } },
    {
      $lookup: {
        from: "creatives",
        localField: "creativeId",
        foreignField: "_id",
        as: "creative",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, image: 1 } }],
      },
    },
    { $unwind: { path: "$creative", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "partnerUserId",
        foreignField: "_id",
        as: "partnerUser",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1, email: 1, role: 1 } }],
      },
    },
    { $unwind: { path: "$partnerUser", preserveNullAndEmptyArrays: true } },
  ]);

  const doc = docs?.[0];
  if (!doc) throwError(404, "Sent creative not found");
  return doc;
};
