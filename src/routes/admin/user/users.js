const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} = require("../../../controllers/admin/user/userController");
const upload = require("../../../middleware/upload");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  upload.single("profilePicture"),
  createUser
);
router.put("/:id", verifyToken, upload.single("profilePicture"), updateUser);
router.get("/:id", verifyToken, getUser);
router.get("/", verifyToken, verifyRole("Super Admin"), getUsers);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteUser);

module.exports = router;
