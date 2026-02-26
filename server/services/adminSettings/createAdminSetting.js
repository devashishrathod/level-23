const AdminSetting = require("../../models/AdminSetting");
const { throwError } = require("../../utils");

exports.createAdminSetting = async (payload) => {
  payload = payload || {};

  const existing = await AdminSetting.findOne({ isDeleted: false });
  if (existing) throwError(400, "Admin setting already exists");

  const doc = await AdminSetting.create(payload);
  return doc;
};
