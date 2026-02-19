const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createPartner } = require("../../services/partners");
const { validateRegister } = require("../../validator/auth");
const { ROLES } = require("../../constants");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateRegister(req.body);
  if (error) throwError(422, cleanJoiError(error));

  const role = (value.role || ROLES.PARTNER)?.toLowerCase();
  if (role !== ROLES.PARTNER) throwError(422, "Role must be partner");

  const image = req.files?.image;
  const result = await createPartner({ ...value, role }, image);
  return sendSuccess(res, 201, "Partner created", result);
});
