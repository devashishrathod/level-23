const Partner = require("../../models/Partner");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.updatePartner = async (id, payload, image) => {
  validateObjectId(id, "Partner Id");

  const partner = await Partner.findById(id);
  if (!partner || partner.isDeleted) throwError(404, "Partner not found");

  const user = await User.findById(partner.userId);
  if (!user || user.isDeleted) throwError(404, "User not found");

  const {
    companyName,
    type,
    commissionPercent,
    address,
    city,
    state,
    notes,
    status,
    projectsCount,
    revenue,
    isActive,
    name,
    email,
    mobile,
  } = payload;

  if (companyName) partner.companyName = companyName?.toLowerCase();
  if (type) partner.type = type?.toLowerCase();
  if (typeof commissionPercent !== "undefined") partner.commissionPercent = commissionPercent;
  if (typeof address !== "undefined") partner.address = address?.toLowerCase();
  if (typeof city !== "undefined") partner.city = city?.toLowerCase();
  if (typeof state !== "undefined") partner.state = state?.toLowerCase();
  if (typeof notes !== "undefined") partner.notes = notes?.toLowerCase();
  if (status) partner.status = status?.toLowerCase();
  if (typeof projectsCount !== "undefined") partner.projectsCount = Number(projectsCount);
  if (typeof revenue !== "undefined") partner.revenue = Number(revenue);
  if (typeof isActive !== "undefined") partner.isActive = isActive;

  if (name) user.name = name?.toLowerCase();
  if (email) user.email = email?.toLowerCase();
  if (mobile) user.mobile = mobile;

  if (image) {
    const imageUrl = await uploadImage(image.tempFilePath);
    user.image = imageUrl;
  }

  partner.updatedAt = new Date();
  user.updatedAt = new Date();

  await partner.save();
  await user.save();

  return { partner, user };
};
