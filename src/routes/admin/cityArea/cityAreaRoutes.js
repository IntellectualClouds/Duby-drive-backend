const express = require("express");
const router = express.Router();
const {
  getAllCityAreas,
  getCityAreaById,
  createCityArea,
  updateCityArea,
  deleteCityArea,
} = require("../../../controllers/admin/cityArea/cityAreaController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  createCityArea
);
router.put("/:id", verifyToken, updateCityArea);
router.get("/:id", verifyToken, getCityAreaById);
router.get("/", verifyToken, verifyRole("Super Admin"), getAllCityAreas);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteCityArea);

module.exports = router;
