const mongoose = require("mongoose");
const Faq = require("../../models/Faq");
const { throwError, validateObjectId } = require("../../utils");

exports.getFaq = async (id) => {
  validateObjectId(id, "FAQ Id");
  const _id = new mongoose.Types.ObjectId(id);

  const docs = await Faq.aggregate([
    { $match: { _id, isDeleted: false } },
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
  ]);

  const result = docs?.[0];
  if (!result) throwError(404, "FAQ not found");
  return result;
};
