const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  send,
  get,
  getAll,
  deleteSentCreative,
} = require("../controllers/sentCreatives");

router.post("/send", isAdmin, send);
router.get("/getAll", verifyJwtToken, getAll);
router.get("/get/:id", verifyJwtToken, get);
router.delete("/delete/:id", isAdmin, deleteSentCreative);

module.exports = router;
