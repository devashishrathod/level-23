const mongoose = require("mongoose");
const TermAndCondition = require("../../models/Terms&Condition");
const { pagination } = require("../../utils");

exports.getAllTermsAndConditions = async (query) => {
  let {
    page,
    limit,
    search,
    title,
    categoryId,
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
  if (title) match.title = { $regex: new RegExp(title, "i") };
  if (categoryId) match.categoryId = new mongoose.Types.ObjectId(categoryId);
  if (search) {
    match.$or = [
      { title: { $regex: new RegExp(search, "i") } },
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
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
        pipeline: [
          {
            $match: { isDeleted: false },
          },
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
        path: "$category",
        preserveNullAndEmptyArrays: false,
      },
    },
  ];

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(TermAndCondition, pipeline, page, limit);
};
