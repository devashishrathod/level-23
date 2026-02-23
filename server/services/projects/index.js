const { createProject } = require("./createProject");
const { getProject } = require("./getProject");
const { getAllProjects } = require("./getAllProjects");
const { updateProject } = require("./updateProject");
const { deleteProject } = require("./deleteProject");

module.exports = {
  createProject,
  getProject,
  getAllProjects,
  updateProject,
  deleteProject,
};
