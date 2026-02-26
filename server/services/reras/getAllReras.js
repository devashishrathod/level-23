const mongoose = require("mongoose");
const Rera = require("../../models/Rera");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllReras = async (query) => {
  let {
    page,
    limit,
    search,
    projectId,
    type,
    reraNo,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (projectId) {
    validateObjectId(projectId, "Project Id");
    match.projectId = new mongoose.Types.ObjectId(projectId);
  }
  if (type) match.type = type;
  if (reraNo) match.reraNo = { $regex: new RegExp(reraNo, "i") };

  if (typeof isActive !== "undefined") {
    match.isActive = isActive === "true" || isActive === true;
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
        pipeline: [{ $match: { isDeleted: false } }],
      },
    },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { reraNo: { $regex: new RegExp(search, "i") } },
          { name: { $regex: new RegExp(search, "i") } },
          { "project.name": { $regex: new RegExp(search, "i") } },
          { "project.reraNo": { $regex: new RegExp(search, "i") } },
        ],
      },
    });
  }

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(Rera, pipeline, page, limit);
};
