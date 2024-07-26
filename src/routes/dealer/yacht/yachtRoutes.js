const express = require("express");
const multer = require("multer");
const {
    createYacht,
    getYachts,
    getYachtById,
    updateYacht,
    deleteYacht,
} = require("../../../controllers/dealer/yacht/yachtController");
const { verifyToken } = require("../../../middleware/auth");
const upload = require("../../../middleware/upload");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.fields([{ name: "images" }, { name: "video" }]),
  createYacht
);

router.get("/", verifyToken, getYachts);

router.get("/:id", verifyToken, getYachtById);

router.put(
  "/:id",
  verifyToken,
  upload.fields([{ name: "images" }, { name: "video" }]),
  updateYacht
);

router.delete("/:id", verifyToken, deleteYacht);

module.exports = router;
