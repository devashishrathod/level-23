const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  get,
  getAll,
  update,
  deleteCostSheet,
} = require("../controllers/costSheets");

router.post("/create", isAdmin, create);
router.get("/getAll", isAdmin, getAll);
router.get("/get/:id", verifyJwtToken, get);
router.put("/update/:id", isAdmin, update);
router.delete("/delete/:id", isAdmin, deleteCostSheet);

module.exports = router;
