const mongoose = require("mongoose");
const SentCreative = require("../../models/SentCreative");
const Creative = require("../../models/Creative");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");
const { SENT_CREATIVE_STATUS } = require("../../constants");
const { sendCreativeMail } = require("../../helpers/nodeMailer");

const normalizeFilesArray = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  return [files];
};

const resolveTemplateFile = (allTemplateFiles, index) => {
  if (!allTemplateFiles || allTemplateFiles.length === 0) return null;
  if (allTemplateFiles.length === 1) return allTemplateFiles[0];
  return allTemplateFiles[index] || null;
};

exports.sendSentCreatives = async (
  { creativeId, partners },
  templateImages,
) => {
  validateObjectId(creativeId, "Creative Id");

  const creative = await Creative.findOne({
    _id: creativeId,
    isDeleted: false,
  });
  if (!creative) throwError(404, "Creative not found");

  const filesArr = normalizeFilesArray(templateImages);
  if (filesArr.length === 0) {
    throwError(422, "Template image is required for sending creative");
  }

  if (partners.length !== filesArr.length) {
    throwError(
      422,
      "Each partner must have a unique template image (number of images must match partners count)",
    );
  }

  const results = [];
  let sentCount = 0;

  for (let i = 0; i < partners.length; i++) {
    const r = partners[i];

    let partnerUserId;
    try {
      validateObjectId(r.partnerUserId, "Partner User Id");
      partnerUserId = new mongoose.Types.ObjectId(r.partnerUserId);
    } catch (e) {
      const failedDoc = await SentCreative.create({
        creativeId,
        partnerUserIdRaw: String(r.partnerUserId || ""),
        templateImage: null,
        isSent: false,
        status: SENT_CREATIVE_STATUS.FAILED,
        sentAt: null,
        isDeleted: false,
      });
      results.push({
        status: "failed",
        reason: "Invalid partner user id",
        doc: failedDoc,
      });
      continue;
    }

    const user = await User.findOne({ _id: partnerUserId, isDeleted: false });
    if (!user || !user.email) {
      const failedDoc = await SentCreative.create({
        creativeId,
        partnerUserId,
        templateImage: null,
        isSent: false,
        status: SENT_CREATIVE_STATUS.FAILED,
        sentAt: null,
        isDeleted: false,
      });
      results.push({
        status: "failed",
        reason: "Partner user not found",
        doc: failedDoc,
      });
      continue;
    }

    const file = resolveTemplateFile(filesArr, i);
    if (!file) {
      const failedDoc = await SentCreative.create({
        creativeId,
        partnerUserId,
        templateImage: null,
        isSent: false,
        status: SENT_CREATIVE_STATUS.FAILED,
        sentAt: null,
        isDeleted: false,
      });
      results.push({
        status: "failed",
        reason: "Template image not found for this recipient",
        doc: failedDoc,
      });
      continue;
    }

    const templateImageUrl = await uploadImage(file.tempFilePath);

    const sentDoc = await SentCreative.create({
      creativeId,
      partnerUserId,
      templateImage: templateImageUrl,
      isSent: false,
      status: SENT_CREATIVE_STATUS.PENDING,
      isDeleted: false,
    });

    try {
      await sendCreativeMail({
        to: user.email,
        partnerName: user.name,
        creativeName: creative.name,
        creativeDescription: creative.description,
        creativeImage: creative.image,
        templateImage: templateImageUrl,
      });

      sentDoc.isSent = true;
      sentDoc.status = SENT_CREATIVE_STATUS.SENT;
      sentDoc.sentAt = new Date();
      sentDoc.updatedAt = new Date();
      await sentDoc.save();

      results.push({ status: "sent", doc: sentDoc });
      sentCount++;
    } catch (err) {
      sentDoc.isSent = false;
      sentDoc.status = SENT_CREATIVE_STATUS.FAILED;
      sentDoc.updatedAt = new Date();
      await sentDoc.save();

      results.push({
        status: "failed",
        reason: err?.message || "Email sending failed",
        doc: sentDoc,
      });
    }
  }

  if (sentCount > 0) {
    await Creative.updateOne(
      { _id: creativeId },
      {
        $set: { isSent: true },
        $inc: { totalPartnerSent: sentCount },
      },
    );
  }

  return {
    creativeId,
    totalRequested: partners?.length || 0,
    totalSent: sentCount,
    totalFailed: (partners?.length || 0) - sentCount,
    results,
  };
};
