const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
  getBanner,
} = require("../../../controllers/admin/banner/bannerController");
const { verifyRole, verifyToken } = require("../../../middleware/auth");

router.post("/", verifyToken, verifyRole("Super Admin"), createBanner);
router.get("/", getBanners);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteBanner);
router.get("/:id", getBanner);

module.exports = router;
