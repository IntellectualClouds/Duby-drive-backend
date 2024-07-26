const express = require("express");
const router = express.Router();

const {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
} = require("../../../controllers/admin/package/packageController");
const { verifyRole, verifyToken } = require("../../../middleware/auth");
const upload = require("../../../middleware/upload");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  upload.single("logo"),
  createPackage
);

router.get("/", getPackages);

router.get("/:id", getPackage);

router.put("/:id", verifyToken, verifyRole("Super Admin"), updatePackage);

router.delete("/:id", verifyToken, verifyRole("Super Admin"), deletePackage);

module.exports = router;
