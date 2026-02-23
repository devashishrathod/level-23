const mongoose = require("mongoose");
const Project = require("../../models/Project");
const Tower = require("../../models/Tower");
const Floor = require("../../models/Floor");
const Unit = require("../../models/Unit");
const { pagination, validateObjectId } = require("../../utils");
const { UNIT_STATUS } = require("../../constants");

exports.getAllProjects = async (query) => {
  let {
    page,
    limit,
    search,
    name,
    developer,
    reraNo,
    categoryId,
    subCategoryId,
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

  if (categoryId) {
    validateObjectId(categoryId, "Category Id");
    match.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  if (subCategoryId) {
    validateObjectId(subCategoryId, "SubCategory Id");
    match.subCategoryId = new mongoose.Types.ObjectId(subCategoryId);
  }

  if (name) match.name = { $regex: new RegExp(name, "i") };
  if (developer) match.developer = { $regex: new RegExp(developer, "i") };
  if (reraNo) match.reraNo = { $regex: new RegExp(reraNo, "i") };

  if (search) {
    match.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { developer: { $regex: new RegExp(search, "i") } },
      { reraNo: { $regex: new RegExp(search, "i") } },
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

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  const paginated = await pagination(Project, pipeline, page, limit);

  const [projectMetrics] = await Project.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalUnits: { $sum: "$totalUnits" },
        noOfSoldUnits: { $sum: "$noOfSoldUnits" },
        noOfReservedUnits: { $sum: "$noOfReservedUnits" },
        noOfAvailableUnits: { $sum: "$noOfAvailableUnits" },
      },
    },
  ]);

  const [towerMetrics] = await Tower.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalTowers: { $sum: 1 } } },
  ]);

  const [floorMetrics] = await Floor.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalFloors: { $sum: 1 } } },
  ]);

  const [unitMetrics] = await Unit.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, totalUnits: { $sum: 1 } } },
  ]);

  const metrics = {
    totalProjects: projectMetrics?.totalProjects || 0,
    totalTowers: towerMetrics?.totalTowers || 0,
    totalFloors: floorMetrics?.totalFloors || 0,
    totalUnits: unitMetrics?.totalUnits || 0,
    noOfSoldUnits: projectMetrics?.noOfSoldUnits || 0,
    noOfReservedUnits: projectMetrics?.noOfReservedUnits || 0,
    noOfAvailableUnits: projectMetrics?.noOfAvailableUnits || 0,
  };

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1);

  const now = new Date();
  const curStart = startOfMonth(now);
  const curEnd = endOfMonth(now);
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevStart = startOfMonth(prev);
  const prevEnd = endOfMonth(prev);

  const monthCounts = async (from, to) => {
    const [r] = await Unit.aggregate([
      { $match: { isDeleted: false, createdAt: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: 1 },
          noOfSoldUnits: {
            $sum: { $cond: [{ $eq: ["$status", UNIT_STATUS.SOLD] }, 1, 0] },
          },
          noOfReservedUnits: {
            $sum: { $cond: [{ $eq: ["$status", UNIT_STATUS.HOLD] }, 1, 0] },
          },
          noOfAvailableUnits: {
            $sum: {
              $cond: [{ $eq: ["$status", UNIT_STATUS.AVAILABLE] }, 1, 0],
            },
          },
        },
      },
    ]);
    return {
      totalUnits: r?.totalUnits || 0,
      noOfSoldUnits: r?.noOfSoldUnits || 0,
      noOfReservedUnits: r?.noOfReservedUnits || 0,
      noOfAvailableUnits: r?.noOfAvailableUnits || 0,
    };
  };

  const buildTrend = (current, previous) => {
    const change = current - previous;
    const changePercent =
      previous === 0 ? (current === 0 ? 0 : 100) : (change / previous) * 100;
    return {
      current,
      previous,
      change,
      changePercent: Number(changePercent.toFixed(2)),
      direction: change >= 0 ? "up" : "down",
    };
  };

  const [curCounts, prevCounts] = await Promise.all([
    monthCounts(curStart, curEnd),
    monthCounts(prevStart, prevEnd),
  ]);

  const trend = {
    totalUnits: buildTrend(curCounts.totalUnits, prevCounts.totalUnits),
    noOfSoldUnits: buildTrend(
      curCounts.noOfSoldUnits,
      prevCounts.noOfSoldUnits,
    ),
    noOfReservedUnits: buildTrend(
      curCounts.noOfReservedUnits,
      prevCounts.noOfReservedUnits,
    ),
    noOfAvailableUnits: buildTrend(
      curCounts.noOfAvailableUnits,
      prevCounts.noOfAvailableUnits,
    ),
  };

  return {
    ...paginated,
    metrics,
    trend,
  };
};
