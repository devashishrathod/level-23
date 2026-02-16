const { create } = require("./create");
const { updatePersonal } = require("./updatePersonal");
const { updateKyc } = require("./updateKyc");
const { updateProperty } = require("./updateProperty");
const { updatePayment } = require("./updatePayment");
const { submit } = require("./submit");
const { updateStatus } = require("./updateStatus");
const { get } = require("./get");
const { getAll } = require("./getAll");
const { deleteBooking } = require("./delete");

module.exports = {
  create,
  updatePersonal,
  updateKyc,
  updateProperty,
  updatePayment,
  submit,
  updateStatus,
  get,
  getAll,
  deleteBooking,
};
