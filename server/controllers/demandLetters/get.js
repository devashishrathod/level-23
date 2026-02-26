const { asyncWrapper, sendSuccess } = require("../../utils");
const { getDemandLetter } = require("../../services/demandLetters");

exports.get = asyncWrapper(async (req, res) => {
  const result = await getDemandLetter(req.params.id);
  return sendSuccess(res, 200, "Demand letter fetched", result);
});
