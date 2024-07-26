const express = require("express");
const {
  createCarType,
  getAllCarTypes,
  getCarTypeById,
  updateCarType,
  deleteCarType,
} = require("../../../controllers/admin/carType/carTypeController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, verifyRole("Super Admin"), createCarType);
router.get("/", verifyToken, getAllCarTypes);
router.get("/:id", verifyToken, getCarTypeById);
router.put("/:id", verifyToken, verifyRole("Super Admin"), updateCarType);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteCarType);

module.exports = router;
