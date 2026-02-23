const mongoose = require("mongoose");
const Project = require("../../models/Project");
const { throwError, validateObjectId } = require("../../utils");

exports.getProject = async (id) => {
  validateObjectId(id, "Project Id");

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
      $lookup: {
        from: "subcategories",
        localField: "subCategoryId",
        foreignField: "_id",
        as: "subCategory",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { name: 1, description: 1, image: 1, isActive: 1 } },
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
  ];

  const [result] = await Project.aggregate(pipeline);
  if (!result) throwError(404, "Project not found");

  return {
    ...result,
    noOfTowers: result.totalTowers || 0,
    noOfFloors: result.totalFloors || 0,
    noOfUnits: result.totalUnits || 0,
  };
};
