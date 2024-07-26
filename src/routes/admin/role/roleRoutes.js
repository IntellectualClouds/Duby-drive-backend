// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const roleController = require("../../../controllers/admin/role/roleController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  roleController.createRole
);
router.get("/:id", roleController.getRole);
router.get(
  "/",
  roleController.getRoles
);
router.put(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  roleController.updateRole
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  roleController.deleteRole
);

module.exports = router;
