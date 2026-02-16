const mongoose = require("mongoose");
const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.getBooking = async (id) => {
  validateObjectId(id, "Booking Id");

  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false,
      },
    },
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
    {
      $project: {
        bookingNo: 1,
        type: 1,
        status: 1,
        bookingDate: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        aadharNumber: 1,
        panNumber: 1,
        alternatePhone: 1,
        address: 1,
        city: 1,
        state: 1,
        pincode: 1,
        kyc: 1,
        property: 1,
        bookingAmount: 1,
        paymentMethod: 1,
        bankName: 1,
        chequeNumber: 1,
        notes: 1,
        isSubmitted: 1,
        isActive: 1,
        createdAt: 1,
      },
    },
  ];

  const [result] = await Booking.aggregate(pipeline);
  if (!result) throwError(404, "Booking not found");
  return result;
};
