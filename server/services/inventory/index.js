const { createInventory } = require("./createInventory");
const { getAllInventory } = require("./getAllInventory");
const { getInventory } = require("./getInventory");
const { updateInventory } = require("./updateInventory");
const { deleteInventory } = require("./deleteInventory");

module.exports = {
  createInventory,
  getAllInventory,
  getInventory,
  updateInventory,
  deleteInventory,
};
