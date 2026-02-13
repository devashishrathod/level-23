const mongoose = require("mongoose");
const Inventory = require("../../models/Inventory");
const { pagination, validateObjectId } = require("../../utils");
const { INVENTORY_STATUS } = require("../../constants");

exports.getAllInventory = async (query) => {
  let {
    page,
    limit,
    search,
    name,
    categoryId,
    status,
    quantity,
    minQuantity,
    maxQuantity,
    price,
    minPrice,
    maxPrice,
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
  if (status) {
    status = status?.toLowerCase();
    match.status = status;
  }
  if (name) match.name = { $regex: new RegExp(name, "i") };
  if (search) {
    match.$or = [{ name: { $regex: new RegExp(search, "i") } }];
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
  if (typeof quantity !== "undefined") match.quantity = Number(quantity);
  else if (
    typeof minQuantity !== "undefined" ||
    typeof maxQuantity !== "undefined"
  ) {
    match.quantity = {};
    if (typeof minQuantity !== "undefined")
      match.quantity.$gte = Number(minQuantity);
    if (typeof maxQuantity !== "undefined")
      match.quantity.$lte = Number(maxQuantity);
  }
  if (typeof price !== "undefined") match.price = Number(price);
  else if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
    match.price = {};
    if (typeof minPrice !== "undefined") match.price.$gte = Number(minPrice);
    if (typeof maxPrice !== "undefined") match.price.$lte = Number(maxPrice);
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
    {
      $project: {
        name: 1,
        category: 1,
        quantity: 1,
        status: 1,
        price: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  const paginated = await pagination(Inventory, pipeline, page, limit);

  const countsPipeline = [
    { $match: match },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ];

  const grouped = await Inventory.aggregate(countsPipeline);

  const totals = {
    totalInventory: 0,
    noOfAvailableInventory: 0,
    noOfReservedInventory: 0,
    noOfSoldInventory: 0,
  };

  grouped.forEach((g) => {
    totals.totalInventory += g.count;
    if (g._id === INVENTORY_STATUS.AVAILABLE)
      totals.noOfAvailableInventory = g.count;
    if (g._id === INVENTORY_STATUS.RESERVED)
      totals.noOfReservedInventory = g.count;
    if (g._id === INVENTORY_STATUS.SOLD) totals.noOfSoldInventory = g.count;
  });

  return {
    ...paginated,
    totals,
  };
};
