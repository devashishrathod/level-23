const mongoose = require("mongoose");
const Unit = require("../../models/Unit");
const { throwError, validateObjectId } = require("../../utils");

exports.getUnit = async (id) => {
  validateObjectId(id, "Unit Id");

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
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "towers",
        localField: "towerId",
        foreignField: "_id",
        as: "tower",
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $project: {
              projectId: 1,
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
        ],
      },
    },
    { $unwind: { path: "$tower", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "floors",
        localField: "floorId",
        foreignField: "_id",
        as: "floor",
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $project: {
              projectId: 1,
              towerId: 1,
              name: 1,
              number: 1,
              description: 1,
              totalUnits: 1,
              noOfSoldUnits: 1,
              noOfReservedUnits: 1,
              noOfAvailableUnits: 1,
              isActive: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$floor", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "users",
        localField: "soldByUserId",
        foreignField: "_id",
        as: "soldByUser",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { name: 1, role: 1, email: 1, mobile: 1 } },
        ],
      },
    },
    { $unwind: { path: "$soldByUser", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "holdByUserId",
        foreignField: "_id",
        as: "holdByUser",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { name: 1, role: 1, email: 1, mobile: 1 } },
        ],
      },
    },
    { $unwind: { path: "$holdByUser", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        project: 1,
        tower: 1,
        floor: 1,
        name: 1,
        number: 1,
        description: 1,
        carpetArea: 1,
        saleableArea: 1,
        unitType: 1,
        facing: 1,
        status: 1,
        soldByUser: 1,
        soldByName: 1,
        holdByUser: 1,
        holdByName: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const [result] = await Unit.aggregate(pipeline);
  if (!result) throwError(404, "Unit not found");
  return result;
};
