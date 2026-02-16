const Property = require("../../models/Property");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteProperty = async (id) => {
  validateObjectId(id, "Property Id");

  const result = await Property.findById(id);
  if (!result || result.isDeleted) throwError(404, "Property not found");

  result.isDeleted = true;
  result.isActive = false;
  result.updatedAt = new Date();
  await result.save();
  return;
};
