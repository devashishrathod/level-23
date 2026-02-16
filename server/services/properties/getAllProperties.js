const mongoose = require("mongoose");
const Property = require("../../models/Property");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllProperties = async (query) => {
  let {
    page,
    limit,
    search,
    projectName,
    towerBlock,
    unitNumber,
    categoryId,
    isActive,
    minTotalPrice,
    maxTotalPrice,
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

  if (categoryId) {
    validateObjectId(categoryId, "Category Id");
    match.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (projectName) match.projectName = { $regex: new RegExp(projectName, "i") };
  if (towerBlock) match.towerBlock = { $regex: new RegExp(towerBlock, "i") };
  if (unitNumber) match.unitNumber = { $regex: new RegExp(unitNumber, "i") };

  if (search) {
    match.$or = [
      { projectName: { $regex: new RegExp(search, "i") } },
      { towerBlock: { $regex: new RegExp(search, "i") } },
      { unitNumber: { $regex: new RegExp(search, "i") } },
    ];
  }

  if (minTotalPrice || maxTotalPrice) {
    match.totalPrice = {};
    if (minTotalPrice) match.totalPrice.$gte = Number(minTotalPrice);
    if (maxTotalPrice) match.totalPrice.$lte = Number(maxTotalPrice);
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

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(Property, pipeline, page, limit);
};
