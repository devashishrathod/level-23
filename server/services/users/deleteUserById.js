const User = require("../../models/User");
const Partner = require("../../models/Partner");
const { throwError, validateObjectId } = require("../../utils");
const { ROLES } = require("../../constants");

exports.deleteUserById = async (userId) => {
  validateObjectId(userId, "User Id");

  const user = await User.findById(userId);
  if (!user || user.isDeleted) throwError(404, "User not found");

  user.isDeleted = true;
  user.isActive = false;
  user.updatedAt = new Date();

  if (user.role === ROLES.PARTNER) {
    await Partner.updateOne(
      { userId: user._id, isDeleted: false },
      { $set: { isDeleted: true, isActive: false, updatedAt: new Date() } },
    );
    user.partnerId = null;
  }

  await user.save();

  return;
};
