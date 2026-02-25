const mongoose = require("mongoose");
const User = require("../../models/User");
const { pagination } = require("../../utils");

exports.getAllUsers = async (query) => {
  let {
    page,
    limit,
    search,
    role,
    name,
    email,
    mobile,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false, role: { $ne: "admin" } };

  if (role) match.role = role;

  if (typeof isActive !== "undefined") {
    match.isActive = isActive === "true" || isActive === true;
  }

  if (name) match.name = { $regex: new RegExp(name, "i") };
  if (email) match.email = { $regex: new RegExp(email, "i") };

  if (typeof mobile !== "undefined") {
    const m = Number(mobile);
    if (!Number.isNaN(m)) match.mobile = m;
  }

  if (search) {
    match.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
    ];

    const m = Number(search);
    if (!Number.isNaN(m)) match.$or.push({ mobile: m });
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
        from: "partners",
        localField: "_id",
        foreignField: "userId",
        as: "partner",
        pipeline: [
          { $match: { isDeleted: false } },
          { $project: { isDeleted: 0 } },
        ],
      },
    },
    { $unwind: { path: "$partner", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        password: 0,
        otp: 0,
        isDeleted: 0,
      },
    },
    {
      $addFields: {
        partner: {
          $cond: [{ $eq: ["$role", "partner"] }, "$partner", null],
        },
      },
    },
  ];
  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });
  return await pagination(User, pipeline, page, limit);
};
