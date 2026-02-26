const Rera = require("../../models/Rera");
const Project = require("../../models/Project");
const { throwError, validateObjectId } = require("../../utils");
const { uploadPDF } = require("../uploads");

exports.createRera = async (payload, file) => {
  payload = payload || {};

  const { type, name, description, reraNo, projectId, isActive } = payload;

  if (!file?.tempFilePath) {
    throwError(422, "RERA PDF file is required");
  }

  validateObjectId(projectId, "Project Id");

  const project = await Project.findOne({ _id: projectId, isDeleted: false });
  if (!project) throwError(404, "Project not found");

  const projectReraNo = (project.reraNo || "").trim();
  const incomingReraNo = (reraNo || "").trim();

  if (!projectReraNo) {
    throwError(
      400,
      "Project RERA number is not set. Please update project first",
    );
  }

  if (projectReraNo !== incomingReraNo) {
    throwError(400, "Project RERA number and RERA number must be same");
  }

  const existingForType = await Rera.findOne({
    projectId,
    type,
    isDeleted: false,
  });
  if (existingForType) {
    throwError(400, "This document type already exists for this project");
  }

  const originalName = file?.name || "rera.pdf";
  const fileName =
    `${projectId}_${type}_${incomingReraNo}_${Date.now()}_${originalName}`
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_.-]/g, "");

  const fileUrl = await uploadPDF(file.tempFilePath, fileName);

  try {
    const doc = await Rera.create({
      type,
      name,
      description,
      reraNo: incomingReraNo,
      file: fileUrl,
      projectId,
      isActive,
    });

    return doc;
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
