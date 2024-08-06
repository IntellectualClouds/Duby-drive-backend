const express = require("express");
const multer = require("multer");
const {
  createDealer,
  updateDealer,
  getDealer,
  getDealers,
  deleteDealer,
} = require("../../../controllers/admin/dealer/dealerController");
const { verifyToken } = require("../../../middleware/auth");
const upload = require("../../../middleware/upload");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "logo" },
    { name: "vatDocumentUrl" },
    { name: "ejariDocumentUrl" },
    { name: "insuranceDocumentUrl" },
    { name: "idCardUrl" },
  ]),
  createDealer
);

router.get("/", verifyToken, getDealers);

router.get("/:id", verifyToken, getDealer);

router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "logo" },
    { name: "vatDocumentUrl" },
    { name: "ejariDocumentUrl" },
    { name: "insuranceDocumentUrl" },
    { name: "idCardUrl" },
  ]),
  updateDealer
);

router.delete("/:id", verifyToken, deleteDealer);

module.exports = router;
