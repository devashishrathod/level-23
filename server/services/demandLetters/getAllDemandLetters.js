const mongoose = require("mongoose");
const DemandLetter = require("../../models/DemandLetter");
const { pagination, validateObjectId } = require("../../utils");
const { DEMAND_LETTER_PAYMENT_STATUS } = require("../../constants");

const monthRange = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
};

exports.getAllDemandLetters = async (query) => {
  let {
    page,
    limit,
    search,
    unitId,
    paymentStatus,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (paymentStatus) match.paymentStatus = paymentStatus;

  if (unitId) {
    validateObjectId(unitId, "Unit Id");
    match["property.unitId"] = new mongoose.Types.ObjectId(unitId);
  }

  if (fromDate || toDate) {
    match["property.letterDate"] = {};
    if (fromDate) match["property.letterDate"].$gte = new Date(fromDate);
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      match["property.letterDate"].$lte = d;
    }
  }

  if (search) {
    match.$or = [
      { "customer.name": { $regex: new RegExp(search, "i") } },
      { "customer.address": { $regex: new RegExp(search, "i") } },
      { "property.subjectLine": { $regex: new RegExp(search, "i") } },
    ];
  }

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "units",
        localField: "property.unitId",
        foreignField: "_id",
        as: "unit",
        pipeline: [
          { $match: { isDeleted: false } },
          {
            $project: {
              projectId: 1,
              towerId: 1,
              floorId: 1,
              number: 1,
              name: 1,
              status: 1,
              saleableArea: 1,
              unitType: 1,
            },
          },
        ],
      },
    },
    { $unwind: { path: "$unit", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "projects",
        localField: "unit.projectId",
        foreignField: "_id",
        as: "project",
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1 } }],
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
  ];

  pipeline.push({
    $project: {
      customer: 1,
      property: 1,
      unit: 1,
      project: 1,
      totalConsideration: 1,
      gst: 1,
      totalPayable: 1,
      amountReceived: 1,
      dueAmount: 1,
      paymentStatus: 1,
      isActive: 1,
      createdAt: 1,
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  const paginated = await pagination(DemandLetter, pipeline, page, limit);

  const baseMatchForMetrics = { isDeleted: false };

  const [metricsAgg] = await DemandLetter.aggregate([
    { $match: baseMatchForMetrics },
    {
      $group: {
        _id: null,
        totalLetters: { $sum: 1 },
        noOfPaidLetters: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", DEMAND_LETTER_PAYMENT_STATUS.PAID] }, 1, 0],
          },
        },
        totalAmount: { $sum: "$totalPayable" },
        totalDueAmount: { $sum: "$dueAmount" },
      },
    },
  ]);

  const now = new Date();
  const { start: thisStart, end: thisEnd } = monthRange(now);

  const [sentThisMonthAgg] = await DemandLetter.aggregate([
    { $match: { ...baseMatchForMetrics, createdAt: { $gte: thisStart, $lt: thisEnd } } },
    { $group: { _id: null, sentThisMonth: { $sum: 1 } } },
  ]);

  const metrics = {
    totalLetters: metricsAgg?.totalLetters || 0,
    noOfPaidLetters: metricsAgg?.noOfPaidLetters || 0,
    pendingPayment:
      (metricsAgg?.totalLetters || 0) - (metricsAgg?.noOfPaidLetters || 0),
    sentThisMonth: sentThisMonthAgg?.sentThisMonth || 0,
    totalAmount: metricsAgg?.totalAmount || 0,
    totalDueAmount: metricsAgg?.totalDueAmount || 0,
  };

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

  const start6 = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1));

  const monthlyTrend = await DemandLetter.aggregate([
    { $match: { ...baseMatchForMetrics, createdAt: { $gte: start6 } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalLetters: { $sum: 1 },
        paidLetters: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", DEMAND_LETTER_PAYMENT_STATUS.PAID] }, 1, 0],
          },
        },
        pendingLetters: {
          $sum: {
            $cond: [{ $eq: ["$paymentStatus", DEMAND_LETTER_PAYMENT_STATUS.PENDING] }, 1, 0],
          },
        },
        totalAmount: { $sum: "$totalPayable" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalLetters: 1,
        paidLetters: 1,
        pendingLetters: 1,
        totalAmount: 1,
      },
    },
  ]);

  return {
    ...paginated,
    metrics,
    monthlyTrend,
  };
};
