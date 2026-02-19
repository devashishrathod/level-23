const Partner = require("../../models/Partner");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");

exports.deletePartner = async (id) => {
  validateObjectId(id, "Partner Id");

  const partner = await Partner.findById(id);
  if (!partner || partner.isDeleted) throwError(404, "Partner not found");

  const user = await User.findById(partner.userId);
  if (!user || user.isDeleted) throwError(404, "User not found");

  partner.isDeleted = true;
  partner.isActive = false;
  partner.updatedAt = new Date();

  user.isDeleted = true;
  user.isActive = false;
  user.partnerId = null;
  user.updatedAt = new Date();

  await partner.save();
  await user.save();

  return;
};
