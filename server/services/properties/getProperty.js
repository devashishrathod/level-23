const mongoose = require("mongoose");
const Property = require("../../models/Property");
const { throwError, validateObjectId } = require("../../utils");

exports.getProperty = async (id) => {
  validateObjectId(id, "Property Id");

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
          { $match: { isDeleted: false } },
          { $project: { name: 1, description: 1, image: 1, isActive: 1 } },
        ],
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        projectName: 1,
        towerBlock: 1,
        unitNumber: 1,
        floor: 1,
        areaSqFt: 1,
        pricePerSqFt: 1,
        totalPrice: 1,
        category: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const [result] = await Property.aggregate(pipeline);
  if (!result) throwError(404, "Property not found");
  return result;
};
