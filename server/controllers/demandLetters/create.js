const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createDemandLetter } = require("../../services/demandLetters");
const { validateCreateDemandLetter } = require("../../validator/demandLetter");

exports.create = asyncWrapper(async (req, res) => {
  const { error, value } = validateCreateDemandLetter(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await createDemandLetter(value);
  return sendSuccess(res, 201, "Demand letter created", result);
});
