const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middlewares");
const { create, get, update } = require("../controllers/adminSettings");

router.post("/create", isAdmin, create);
router.get("/get", isAdmin, get);
router.put("/update", isAdmin, update);

module.exports = router;
