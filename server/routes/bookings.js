const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  updatePersonal,
  updateKyc,
  updateProperty,
  updatePayment,
  submit,
  get,
  getAll,
  updateStatus,
  deleteBooking,
} = require("../controllers/bookings");

router.post("/create", isAdmin, create);
router.put("/updatePersonal/:id", isAdmin, updatePersonal);
router.put("/updateKyc/:id", isAdmin, updateKyc);
router.put("/updateProperty/:id", isAdmin, updateProperty);
router.put("/updatePayment/:id", isAdmin, updatePayment);
router.put("/submit/:id", isAdmin, submit);
router.put("/updateStatus/:id", isAdmin, updateStatus);

router.get("/getAll", verifyJwtToken, getAll);
router.get("/get/:id", verifyJwtToken, get);
router.delete("/delete/:id", isAdmin, deleteBooking);

module.exports = router;
