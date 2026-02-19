const mongoose = require("mongoose");
const Partner = require("../../models/Partner");
const { throwError, validateObjectId } = require("../../utils");

exports.getPartner = async (id) => {
  validateObjectId(id, "Partner Id");

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { password: 0, otp: 0, isDeleted: 0 } },
        ],
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        companyName: 1,
        type: 1,
        commissionPercent: 1,
        address: 1,
        city: 1,
        state: 1,
        notes: 1,
        status: 1,
        projectsCount: 1,
        revenue: 1,
        isActive: 1,
        createdAt: 1,
        user: 1,
      },
    },
  ];

  const [result] = await Partner.aggregate(pipeline);
  if (!result) throwError(404, "Partner not found");
  return result;
};
