const express = require("express");
const multer = require("multer");
const {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../../../controllers/dealer/car/carController");
const { verifyToken } = require("../../../middleware/auth");
const upload = require("../../../middleware/upload");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  // upload.single("featureImage"),
  upload.fields([{ name: "carImages" }, { name: "carVideo" },{name:"featureImage"}]),
  createCar
);

router.get("/", verifyToken, getAllCars);

router.get("/:id", verifyToken, getCarById);

router.put(
  "/:id",
  verifyToken,
  upload.fields([{ name: "carImages" }, { name: "carVideo" }]),
  updateCar
);

router.delete("/:id", verifyToken, deleteCar);

module.exports = router;
