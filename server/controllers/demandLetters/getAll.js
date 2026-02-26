const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllDemandLetters } = require("../../services/demandLetters");
const { validateGetAllDemandLetterQuery } = require("../../validator/demandLetter");

exports.getAll = asyncWrapper(async (req, res) => {
  const { error, value } = validateGetAllDemandLetterQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllDemandLetters(value);
  return sendSuccess(res, 200, "Demand letter list fetched", result);
});
