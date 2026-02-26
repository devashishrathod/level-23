const AdminSetting = require("../../models/AdminSetting");

exports.getAdminSetting = async () => {
  return await AdminSetting.findOne({ isDeleted: false });
};
