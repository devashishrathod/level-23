const mongoose = require("mongoose");
const Tower = require("../../models/Tower");
const { throwError, validateObjectId } = require("../../utils");

exports.getTower = async (id) => {
  validateObjectId(id, "Tower Id");

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
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
              pipeline: [
                { $match: { isDeleted: false } },
                {
                  $project: { name: 1, description: 1, image: 1, isActive: 1 },
                },
              ],
            },
          },
          { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
          {
            $lookup: {
              from: "subcategories",
              localField: "subCategoryId",
              foreignField: "_id",
              as: "subCategory",
              pipeline: [
                { $match: { isDeleted: false } },
                {
                  $project: { name: 1, description: 1, image: 1, isActive: 1 },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$subCategory",
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $project: {
              name: 1,
              description: 1,
              developer: 1,
              reraNo: 1,
              completionDate: 1,
              totalTowers: 1,
              totalFloors: 1,
              totalUnits: 1,
              noOfSoldUnits: 1,
              noOfReservedUnits: 1,
              noOfAvailableUnits: 1,
              isActive: 1,
              createdAt: 1,
              category: 1,
              subCategory: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$project",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        project: 1,
        name: 1,
        number: 1,
        description: 1,
        totalFloors: 1,
        totalUnits: 1,
        noOfSoldUnits: 1,
        noOfReservedUnits: 1,
        noOfAvailableUnits: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const [result] = await Tower.aggregate(pipeline);
  if (!result) throwError(404, "Tower not found");

  return {
    ...result,
    noOfFloors: result.totalFloors || 0,
    noOfUnits: result.totalUnits || 0,
  };
};
