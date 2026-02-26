const mongoose = require("mongoose");
const Faq = require("../../models/Faq");
const { pagination, validateObjectId } = require("../../utils");

exports.getAllFaqs = async (query) => {
  let {
    page,
    limit,
    search,
    categoryId,
    title,
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

  if (title) match.title = { $regex: new RegExp(title, "i") };

  if (search) {
    match.$or = [
      { title: { $regex: new RegExp(search, "i") } },
      { answer: { $regex: new RegExp(search, "i") } },
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
        pipeline: [{ $match: { isDeleted: false } }, { $project: { name: 1 } }],
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        categoryId: 1,
        category: 1,
        title: 1,
        answer: 1,
        images: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(Faq, pipeline, page, limit);
};
