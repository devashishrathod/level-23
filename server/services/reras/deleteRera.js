const Rera = require("../../models/Rera");
const { throwError, validateObjectId } = require("../../utils");
const { deletePDF } = require("../uploads");

exports.deleteRera = async (id) => {
  validateObjectId(id, "Rera Id");

  const rera = await Rera.findById(id);
  if (!rera || rera.isDeleted) throwError(404, "RERA not found");

  const oldUrl = rera.file;

  rera.isDeleted = true;
  rera.isActive = false;
  rera.updatedAt = new Date();
  await rera.save();

  if (oldUrl) {
    try {
      await deletePDF(oldUrl);
    } catch (e) {
      // ignore cleanup error
    }
  }

  return;
};
