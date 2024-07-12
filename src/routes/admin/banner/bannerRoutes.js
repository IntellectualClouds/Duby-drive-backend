const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanners,
  deleteBanner,
  getBanner,
} = require("../../../controllers/admin/banner/bannerController");

router.post("/", createBanner);
router.get("/", getBanners);
router.delete("/:id", deleteBanner);
router.get("/:id", getBanner);

module.exports = router;
