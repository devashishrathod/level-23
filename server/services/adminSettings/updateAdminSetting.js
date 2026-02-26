const AdminSetting = require("../../models/AdminSetting");
const { throwError } = require("../../utils");

exports.updateAdminSetting = async (payload) => {
  payload = payload || {};

  const setting = await AdminSetting.findOne({ isDeleted: false });
  if (!setting) throwError(404, "Admin setting not found");

  const { costSheetRates, isActive } = payload;

  if (typeof isActive !== "undefined") setting.isActive = isActive;

  if (costSheetRates) {
    setting.costSheetRates = {
      ...(setting.costSheetRates || {}),
      ...costSheetRates,
    };
  }

  setting.updatedAt = new Date();
  await setting.save();

  return setting;
};
