const Rera = require("../../models/Rera");
const Project = require("../../models/Project");
const { throwError, validateObjectId } = require("../../utils");
const { uploadPDF, deletePDF } = require("../uploads");

exports.updateRera = async (id, payload, file) => {
  validateObjectId(id, "Rera Id");

  payload = payload || {};
  const { type, name, description, reraNo, projectId, isActive } = payload;

  const rera = await Rera.findById(id);
  if (!rera || rera.isDeleted) throwError(404, "RERA not found");

  const nextProjectId = projectId || rera.projectId;
  const nextType = type || rera.type;
  validateObjectId(nextProjectId, "Project Id");

  const project = await Project.findOne({
    _id: nextProjectId,
    isDeleted: false,
  });
  if (!project) throwError(404, "Project not found");

  const projectReraNo = (project.reraNo || "").trim();
  if (!projectReraNo) {
    throwError(
      400,
      "Project RERA number is not set. Please update project first",
    );
  }

  const incomingReraNo =
    typeof reraNo !== "undefined" ? (reraNo || "").trim() : rera.reraNo;
  if (projectReraNo !== incomingReraNo) {
    throwError(400, "Project RERA number and RERA number must be same");
  }

  if (
    String(nextProjectId) !== String(rera.projectId) ||
    String(nextType) !== String(rera.type)
  ) {
    const exists = await Rera.findOne({
      projectId: nextProjectId,
      type: nextType,
      isDeleted: false,
      _id: { $ne: rera._id },
    });
    if (exists) {
      throwError(400, "This document type already exists for this project");
    }
    rera.projectId = nextProjectId;
    rera.type = nextType;
  }

  if (typeof type !== "undefined") rera.type = nextType;
  if (typeof name !== "undefined") rera.name = name;
  if (typeof description !== "undefined") rera.description = description;
  if (typeof reraNo !== "undefined") rera.reraNo = incomingReraNo;
  if (typeof isActive !== "undefined") rera.isActive = isActive;

  if (file?.tempFilePath) {
    const originalName = file?.name || "rera.pdf";
    const fileName =
      `${rera.projectId}_${rera.type}_${incomingReraNo}_${Date.now()}_${originalName}`
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_.-]/g, "");

    const newUrl = await uploadPDF(file.tempFilePath, fileName);
    const oldUrl = rera.file;
    rera.file = newUrl;
    if (oldUrl) {
      try {
        await deletePDF(oldUrl);
      } catch (e) {
        // ignore cleanup error
      }
    }
  }

  rera.updatedAt = new Date();

  try {
    await rera.save();
    return rera;
  } catch (err) {
    if (err?.code === 11000) {
      const keyPattern = err?.keyPattern || {};
      if (keyPattern.projectId && keyPattern.type) {
        throwError(400, "This document type already exists for this project");
      }
      throwError(400, "Duplicate RERA record");
    }
    throw err;
  }
};
