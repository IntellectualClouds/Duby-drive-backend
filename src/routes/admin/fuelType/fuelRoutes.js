const express = require("express");
const {
  createFuelType,
  getAllFuelTypes,
  getFuelTypeById,
  updateFuelType,
  deleteFuelType,
} = require("../../../controllers/admin/fuelType/fuelController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, verifyRole("Super Admin"), createFuelType);
router.get("/", verifyToken, getAllFuelTypes);
router.get("/:id", verifyToken, getFuelTypeById);
router.put("/:id", verifyToken, verifyRole("Super Admin"), updateFuelType);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteFuelType);

module.exports = router;
