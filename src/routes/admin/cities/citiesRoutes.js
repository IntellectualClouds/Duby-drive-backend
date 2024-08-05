const express = require("express");
const router = express.Router();
const {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
} = require("../../../controllers/admin/cities/citiesController");
const upload = require("../../../middleware/upload");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  upload.single("image"),
  createCity
);
router.put("/:id", verifyToken, upload.single("image"), updateCity);
router.get("/:id", verifyToken, getCityById);
router.get("/", verifyToken, verifyRole("Super Admin"), getAllCities);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteCity);

module.exports = router;
