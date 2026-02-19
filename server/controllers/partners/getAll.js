const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllPartners } = require("../../services/partners");
const { validateGetAllPartnerQuery } = require("../../validator/partner");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllPartnerQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllPartners(value);
  return sendSuccess(res, 200, "Partners fetched", result);
});
