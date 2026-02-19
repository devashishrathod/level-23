const User = require("../../models/User");
const { ROLES, LOGIN_TYPES } = require("../../constants");
const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { validateRegister } = require("../../validator/auth");
const { createPartner } = require("../../services/partners");
const { uploadImage } = require("../../services/uploads");

exports.register = asyncWrapper(async (req, res) => {
  const { error, value } = validateRegister(req.body);
  if (error) throwError(422, cleanJoiError(error));
  let { name, email, password, mobile, role, loginType, fcmToken } = value;
  if (!mobile && !email) {
    throwError(422, "Email or Mobile number any one of this is required");
  }
  email = email?.toLowerCase();
  name = name?.toLowerCase();
  role = role?.toLowerCase() || ROLES.USER;
  loginType = loginType?.toLowerCase() || LOGIN_TYPES.PASSWORD;
  const image = req.files?.image;
  if (role === ROLES.PARTNER) {
    const { user, partner } = await createPartner({ ...value, role }, image);
    const token = user.getSignedJwtToken();
    return sendSuccess(res, 201, "Partner registered successfully", {
      user,
      partner,
      token,
    });
  }
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
  const token = user.getSignedJwtToken();
  return sendSuccess(res, 201, "User registered successfully", { user, token });
});
