const mongoose = require("mongoose");
const TermAndCondition = require("../../models/Terms&Condition");
const { throwError, validateObjectId } = require("../../utils");

exports.getTermAndCondition = async (id) => {
  validateObjectId(id, "TermAndCondition Id");

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
        pipeline: [
          {
            $match: { isDeleted: false },
          },
          {
            $project: {
              name: 1,
              description: 1,
              image: 1,
              isActive: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  const [result] = await TermAndCondition.aggregate(pipeline);

  if (!result) {
    throwError(404, "Term and condition not found");
  }

  return result;
};
