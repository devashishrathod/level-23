const mongoose = require("mongoose");
const Booking = require("../../models/Booking");
const { pagination, validateObjectId } = require("../../utils");
const { BOOKING_TYPES } = require("../../constants");

const monthRange = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start, end };
};

exports.getAllBookings = async (query) => {
  let {
    page,
    limit,
    search,
    bookingNo,
    type,
    status,
    paymentMethod,
    propertyId,
    categoryId,
    firstName,
    lastName,
    email,
    phoneNumber,
    city,
    state,
    pincode,
    bookingAmount,
    minBookingAmount,
    maxBookingAmount,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (bookingNo) match.bookingNo = { $regex: new RegExp(bookingNo, "i") };
  if (type) match.type = type?.toLowerCase();
  if (status) match.status = status?.toLowerCase();
  if (paymentMethod) match.paymentMethod = paymentMethod?.toLowerCase();

  if (propertyId) {
    validateObjectId(propertyId, "Property Id");
    match.propertyId = new mongoose.Types.ObjectId(propertyId);
  }

  if (firstName) match.firstName = { $regex: new RegExp(firstName, "i") };
  if (lastName) match.lastName = { $regex: new RegExp(lastName, "i") };
  if (email) match.email = { $regex: new RegExp(email, "i") };
  if (phoneNumber) match.phoneNumber = { $regex: new RegExp(phoneNumber, "i") };
  if (city) match.city = { $regex: new RegExp(city, "i") };
  if (state) match.state = { $regex: new RegExp(state, "i") };
  if (pincode) match.pincode = { $regex: new RegExp(pincode, "i") };

  if (search) {
    match.$or = [
      { bookingNo: { $regex: new RegExp(search, "i") } },
      { firstName: { $regex: new RegExp(search, "i") } },
      { lastName: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
      { phoneNumber: { $regex: new RegExp(search, "i") } },
      { city: { $regex: new RegExp(search, "i") } },
    ];
  }

  if (typeof bookingAmount !== "undefined") match.bookingAmount = Number(bookingAmount);
  else if (typeof minBookingAmount !== "undefined" || typeof maxBookingAmount !== "undefined") {
    match.bookingAmount = {};
    if (typeof minBookingAmount !== "undefined") match.bookingAmount.$gte = Number(minBookingAmount);
    if (typeof maxBookingAmount !== "undefined") match.bookingAmount.$lte = Number(maxBookingAmount);
  }

  if (fromDate || toDate) {
    match.bookingDate = {};
    if (fromDate) match.bookingDate.$gte = new Date(fromDate);
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      match.bookingDate.$lte = d;
    }
  }

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "properties",
        localField: "propertyId",
        foreignField: "_id",
        as: "property",
        pipeline: [
          { $match: { isDeleted: false } },
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
        ],
      },
    },
    {
      $unwind: {
        path: "$property",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (categoryId) {
    validateObjectId(categoryId, "Category Id");
    pipeline.push({
      $match: {
        "property.category._id": new mongoose.Types.ObjectId(categoryId),
      },
    });
  }

  pipeline.push({
    $project: {
      bookingNo: 1,
      type: 1,
      status: 1,
      bookingDate: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      phoneNumber: 1,
      city: 1,
      state: 1,
      pincode: 1,
      property: 1,
      bookingAmount: 1,
      paymentMethod: 1,
      isSubmitted: 1,
      isActive: 1,
      createdAt: 1,
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  const paginated = await pagination(Booking, pipeline, page, limit);

  // Dashboard Metrics (monthly trend)
  const now = new Date();
  const { start: thisStart, end: thisEnd } = monthRange(now);
  const { start: prevStart, end: prevEnd } = monthRange(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const baseMatchForMetrics = { isDeleted: false };

  const [counts] = await Booking.aggregate([
    { $match: baseMatchForMetrics },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        newBookings: {
          $sum: { $cond: [{ $eq: ["$type", BOOKING_TYPES.NEW] }, 1, 0] },
        },
        resaleBookings: {
          $sum: { $cond: [{ $eq: ["$type", BOOKING_TYPES.RESALE] }, 1, 0] },
        },
      },
    },
  ]);

  const [revenueThis] = await Booking.aggregate([
    { $match: { ...baseMatchForMetrics, bookingDate: { $gte: thisStart, $lt: thisEnd } } },
    { $group: { _id: null, revenue: { $sum: "$bookingAmount" } } },
  ]);

  const [revenuePrev] = await Booking.aggregate([
    { $match: { ...baseMatchForMetrics, bookingDate: { $gte: prevStart, $lt: prevEnd } } },
    { $group: { _id: null, revenue: { $sum: "$bookingAmount" } } },
  ]);

  const thisRevenue = revenueThis?.revenue || 0;
  const prevRevenue = revenuePrev?.revenue || 0;

  const revenueChangePercent = prevRevenue === 0
    ? thisRevenue > 0
      ? 100
      : 0
    : ((thisRevenue - prevRevenue) / prevRevenue) * 100;

  const revenueTrend = thisRevenue >= prevRevenue ? "increasing" : "decreasing";

  const metrics = {
    totalBookings: counts?.totalBookings || 0,
    newBookings: counts?.newBookings || 0,
    resaleBookings: counts?.resaleBookings || 0,
    revenue: thisRevenue,
    revenueTrend,
    revenueChangePercent: Number(revenueChangePercent.toFixed(2)),
  };

  return {
    ...paginated,
    metrics,
  };
};
