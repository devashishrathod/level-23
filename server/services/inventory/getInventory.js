const mongoose = require("mongoose");
const Inventory = require("../../models/Inventory");
const { throwError, validateObjectId } = require("../../utils");

exports.getInventory = async (id) => {
  validateObjectId(id, "Inventory Id");

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
    {
      $project: {
        name: 1,
        category: 1,
        quantity: 1,
        status: 1,
        price: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const [result] = await Inventory.aggregate(pipeline);
  if (!result) throwError(404, "Inventory not found");
  return result;
};
