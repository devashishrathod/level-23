const mongoose = require("mongoose");
const SentCreative = require("../../models/SentCreative");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllSentCreatives = async (query) => {
  let {
    page,
    limit,
    creativeId,
    partnerUserId,
    status,
    isSent,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (creativeId) {
    validateObjectId(creativeId, "Creative Id");
    match.creativeId = new mongoose.Types.ObjectId(creativeId);
  }

  if (partnerUserId) {
    validateObjectId(partnerUserId, "Partner User Id");
    match.partnerUserId = new mongoose.Types.ObjectId(partnerUserId);
  }

  if (status) match.status = status;

  if (typeof isSent !== "undefined") {
    match.isSent = isSent === "true" || isSent === true;
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
        from: "creatives",
        localField: "creativeId",
        foreignField: "_id",
        as: "creative",
        pipeline: [{ $project: { name: 1, image: 1 } }],
      },
    },
    { $unwind: { path: "$creative", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "partnerUserId",
        foreignField: "_id",
        as: "partnerUser",
        pipeline: [{ $project: { name: 1, email: 1 } }],
      },
    },
    { $unwind: { path: "$partnerUser", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        creativeId: 1,
        creative: 1,
        partnerUserId: 1,
        partnerUser: 1,
        templateImage: 1,
        isSent: 1,
        status: 1,
        sentAt: 1,
        createdAt: 1,
      },
    },
  ];

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(SentCreative, pipeline, page, limit);
};
