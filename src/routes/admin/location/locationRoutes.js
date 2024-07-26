// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} = require("../../../controllers/admin/location/locationController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

router.post(
  "/",
  verifyToken,
  verifyRole("Super Admin"),
  createLocation
);
router.get("/:id", getLocationById);
router.get("/", getLocations);
router.put(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  updateLocation
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole("Super Admin"),
  deleteLocation
);

module.exports = router;
