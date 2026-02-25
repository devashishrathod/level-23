const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users");
const { verifyJwtToken, isAdmin } = require("../middlewares");

router.get("/get", verifyJwtToken, getUser);
router.put("/update", verifyJwtToken, updateUser);
router.get("/getAll", isAdmin, getAllUsers);
router.delete("/delete/:id", isAdmin, deleteUser);

module.exports = router;
