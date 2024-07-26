const express = require("express");
const {
  createFeature,
  getAllFeatures,
  getFeatureById,
  updateFeature,
  deleteFeature,
} = require("../../../controllers/admin/carFeatures/carFeaturesController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, verifyRole("Super Admin"), createFeature);
router.get("/", verifyToken, getAllFeatures);
router.get("/:id", verifyToken, getFeatureById);
router.put("/:id", verifyToken, verifyRole("Super Admin"), updateFeature);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteFeature);

module.exports = router;
