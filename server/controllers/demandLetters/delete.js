const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteDemandLetter } = require("../../services/demandLetters");

exports.deleteDemandLetter = asyncWrapper(async (req, res) => {
  await deleteDemandLetter(req.params.id);
  return sendSuccess(res, 200, "Demand letter deleted", null);
});
