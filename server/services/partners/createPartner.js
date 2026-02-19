const User = require("../../models/User");
const Partner = require("../../models/Partner");
const { ROLES, LOGIN_TYPES, PARTNER_STATUS } = require("../../constants");
const { throwError } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createPartner = async (payload, image) => {
  let {
    name,
    email,
    password,
    mobile,
    role,
    loginType,
    fcmToken,
    companyName,
    type,
    commissionPercent,
    address,
    city,
    state,
    notes,
    status,
  } = payload;
  if (!mobile && !email) {
    throwError(422, "Email or Mobile number any one of this is required");
  }
  email = email?.toLowerCase();
  name = name?.toLowerCase();
  role = role?.toLowerCase() || ROLES.PARTNER;
  loginType = loginType?.toLowerCase() || LOGIN_TYPES.PASSWORD;
  if (role !== ROLES.PARTNER) throwError(422, "Role must be partner");
  let user;
  if (email) {
    user = await User.findOne({ email, role, isDeleted: false });
    if (user) throwError(400, "User with this email already exists");
  }
  if (mobile) {
    user = await User.findOne({ mobile, role, isDeleted: false });
    if (user) throwError(400, "User with mobile number already exists");
  }
  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);
  const userData = {
    name,
    password,
    email,
    mobile,
    role,
    fcmToken,
    loginType,
    image: imageUrl,
    isLoggedIn: true,
    isOnline: true,
  };
  user = await User.create(userData);
  try {
    const partner = await Partner.create({
      userId: user._id,
      companyName: companyName?.toLowerCase(),
      type: type?.toLowerCase(),
      commissionPercent,
      address: address?.toLowerCase(),
      city: city?.toLowerCase(),
      state: state?.toLowerCase(),
      notes: notes?.toLowerCase(),
      status: status?.toLowerCase() || PARTNER_STATUS.PENDING,
    });
    user.partnerId = partner._id;
    await user.save();
    return { user, partner };
  } catch (e) {
    await User.deleteOne({ _id: user._id });
    throw e;
  }
};
