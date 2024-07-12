// src/routes/users.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
  getUserByRole,
  getUser,
  getUsers,
} = require("../../../controllers/admin/user/userController");
const upload = require("../../../middleware/upload");

router.post("/", upload.single("profilePicture"), createUser);
router.put("/:id", upload.single("profilePicture"), updateUser);
router.get("/:id", getUserByRole);
router.get("/:id", getUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

module.exports = router;
