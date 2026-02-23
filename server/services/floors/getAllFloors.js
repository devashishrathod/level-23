const mongoose = require("mongoose");
const Floor = require("../../models/Floor");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllFloors = async (query) => {
  let {
    page,
    limit,
    search,
    projectId,
    towerId,
    number,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (typeof isActive !== "undefined") {
    match.isActive = isActive === "true" || isActive === true;
  }

  if (projectId) {
    validateObjectId(projectId, "Project Id");
    match.projectId = new mongoose.Types.ObjectId(projectId);
  }

  if (towerId) {
    validateObjectId(towerId, "Tower Id");
    match.towerId = new mongoose.Types.ObjectId(towerId);
  }

  if (typeof number !== "undefined") match.number = Number(number);

  if (search) {
    match.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { description: { $regex: new RegExp(search, "i") } },
    ];
  }

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      match.createdAt.$lte = d;
    }
  }

  const pipeline = [
    { $match: match },
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
    {
      $unwind: {
        path: "$tower",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        project: 1,
        tower: 1,
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
  ];

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(Floor, pipeline, page, limit);
};
