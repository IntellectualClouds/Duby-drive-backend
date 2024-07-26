const express = require("express");
const router = express.Router();
const {
  createCarBrand,
  getAllCarBrands,
  getCarBrandById,
  updateCarBrand,
  deleteCarBrand,
} = require("../../../controllers/admin/carBrand/carBrandController");
const { verifyRole, verifyToken } = require("../../../middleware/auth");
const upload = require("../../../middleware/upload");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  upload.single("brandLogo"),
  createCarBrand
);
router.get("/", getAllCarBrands);
router.get("/:id", getCarBrandById);
router.put("/:id", verifyToken, verifyRole("Super Admin"), updateCarBrand);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteCarBrand);

module.exports = router;
