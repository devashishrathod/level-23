const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  create,
  get,
  getAll,
  update,
  deleteProperty,
} = require("../controllers/properties");

router.post("/create", isAdmin, create);
router.get("/getAll", verifyJwtToken, getAll);
router.get("/get/:id", verifyJwtToken, get);
router.put("/update/:id", isAdmin, update);
router.delete("/delete/:id", isAdmin, deleteProperty);

module.exports = router;
