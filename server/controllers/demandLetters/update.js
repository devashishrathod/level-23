const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateDemandLetter } = require("../../services/demandLetters");
const { validateUpdateDemandLetter } = require("../../validator/demandLetter");

exports.update = asyncWrapper(async (req, res) => {
  const { error, value } = validateUpdateDemandLetter(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const result = await updateDemandLetter(req.params.id, value);
  return sendSuccess(res, 200, "Demand letter updated", result);
});
