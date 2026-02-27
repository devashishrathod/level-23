const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { sendSentCreatives } = require("../../services/sentCreatives");
const { validateSendCreative } = require("../../validator/sentCreatives");

exports.send = asyncWrapper(async (req, res) => {
  const partners = req.body?.partners
    ? typeof req.body.partners === "string"
      ? JSON.parse(req.body.partners)
      : req.body.partners
    : undefined;

  const payload = {
    creativeId: req.body?.creativeId,
    partners,
  };

  const { error, value } = validateSendCreative(payload);
  if (error) throwError(422, cleanJoiError(error));

  const templateImages = req.files?.templateImage;
  const result = await sendSentCreatives(value, templateImages);
  return sendSuccess(res, 200, "Creative sent", result);
});
