const mongoose = require("mongoose");
const Partner = require("../../models/Partner");
const { pagination, validateObjectId } = require("../../utils");
const { PARTNER_STATUS } = require("../../constants");

const monthRange = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
};

exports.getAllPartners = async (query) => {
  let {
    page,
    limit,
    search,
    type,
    status,
    userId,
    companyName,
    name,
    email,
    mobile,
    minRevenue,
    maxRevenue,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (type) match.type = type?.toLowerCase();
  if (status) match.status = status?.toLowerCase();

  if (userId) {
    validateObjectId(userId, "User Id");
    match.userId = new mongoose.Types.ObjectId(userId);
  }

  if (companyName) match.companyName = { $regex: new RegExp(companyName, "i") };

  if (typeof minRevenue !== "undefined" || typeof maxRevenue !== "undefined") {
    match.revenue = {};
    if (typeof minRevenue !== "undefined") match.revenue.$gte = Number(minRevenue);
    if (typeof maxRevenue !== "undefined") match.revenue.$lte = Number(maxRevenue);
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
  ];

  const userMatch = {};
  if (name) userMatch["user.name"] = { $regex: new RegExp(name, "i") };
  if (email) userMatch["user.email"] = { $regex: new RegExp(email, "i") };
  if (mobile) userMatch["user.mobile"] = { $regex: new RegExp(mobile, "i") };

  if (search) {
    userMatch.$or = [
      { "user.name": { $regex: new RegExp(search, "i") } },
      { "user.email": { $regex: new RegExp(search, "i") } },
      { companyName: { $regex: new RegExp(search, "i") } },
      { type: { $regex: new RegExp(search, "i") } },
      { status: { $regex: new RegExp(search, "i") } },
    ];
  }

  if (Object.keys(userMatch).length) pipeline.push({ $match: userMatch });

  pipeline.push({
    $project: {
      companyName: 1,
      type: 1,
      commissionPercent: 1,
      status: 1,
      projectsCount: 1,
      revenue: 1,
      isActive: 1,
      createdAt: 1,
      user: 1,
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  const paginated = await pagination(Partner, pipeline, page, limit);

  const now = new Date();
  const { start: thisStart, end: thisEnd } = monthRange(now);
  const { start: prevStart, end: prevEnd } = monthRange(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const [counts] = await Partner.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        noOfActivePartners: {
          $sum: { $cond: [{ $eq: ["$status", PARTNER_STATUS.ACTIVE] }, 1, 0] },
        },
        noOfInactivePartners: {
          $sum: { $cond: [{ $eq: ["$status", PARTNER_STATUS.INACTIVE] }, 1, 0] },
        },
        noOfPendingPartners: {
          $sum: { $cond: [{ $eq: ["$status", PARTNER_STATUS.PENDING] }, 1, 0] },
        },
      },
    },
  ]);

  const [revenueThis] = await Partner.aggregate([
    { $match: { isDeleted: false, createdAt: { $gte: thisStart, $lt: thisEnd } } },
    { $group: { _id: null, revenue: { $sum: "$revenue" }, newThisMonth: { $sum: 1 } } },
  ]);

  const [revenuePrev] = await Partner.aggregate([
    { $match: { isDeleted: false, createdAt: { $gte: prevStart, $lt: prevEnd } } },
    { $group: { _id: null, revenue: { $sum: "$revenue" }, newPrevMonth: { $sum: 1 } } },
  ]);

  const thisRevenue = revenueThis?.revenue || 0;
  const prevRevenue = revenuePrev?.revenue || 0;

  const revenueChangePercent = prevRevenue === 0
    ? thisRevenue > 0
      ? 100
      : 0
    : ((thisRevenue - prevRevenue) / prevRevenue) * 100;

  const revenueTrend = thisRevenue >= prevRevenue ? "increasing" : "decreasing";

  const newThisMonth = revenueThis?.newThisMonth || 0;
  const newPrevMonth = revenuePrev?.newPrevMonth || 0;

  const newChangePercent = newPrevMonth === 0
    ? newThisMonth > 0
      ? 100
      : 0
    : ((newThisMonth - newPrevMonth) / newPrevMonth) * 100;

  const newTrend = newThisMonth >= newPrevMonth ? "increasing" : "decreasing";

  const metrics = {
    total: counts?.total || 0,
    noOfActivePartners: counts?.noOfActivePartners || 0,
    noOfInactivePartners: counts?.noOfInactivePartners || 0,
    noOfPendingPartners: counts?.noOfPendingPartners || 0,
    totalRevenue: thisRevenue,
    newThisMonth,
    revenueTrend,
    revenueChangePercent: Number(revenueChangePercent.toFixed(2)),
    newThisMonthTrend: newTrend,
    newThisMonthChangePercent: Number(newChangePercent.toFixed(2)),
  };

  return {
    ...paginated,
    metrics,
  };
};
