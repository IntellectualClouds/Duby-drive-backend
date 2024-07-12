// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const roleController = require("../../../controllers/admin/role/roleController");

router.post("/", roleController.createRole);
router.get("/:roleId", roleController.getRole);
router.get("/", roleController.getRoles);
router.put("/:roleId", roleController.updateRole);
router.delete("/:roleId", roleController.deleteRole);

module.exports = router;
