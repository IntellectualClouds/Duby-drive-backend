// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const {
  createYachtType,
  getYachtTypes,
  updateYachtType,
  deleteYachtType,
  getYachtTypeById,
} = require("../../../controllers/admin/yactType/yachtTypeController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  createYachtType
);
router.get("/:id", getYachtTypeById);
router.get(
  "/",
  getYachtTypes
);
router.put(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  updateYachtType
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  deleteYachtType
);

module.exports = router;
