const express = require("express");
const {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
} = require("../../../controllers/admin/insuranceType/insuranceController");
const { verifyToken, verifyRole } = require("../../../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, verifyRole("Super Admin"), createInsurance);
router.get("/", getAllInsurance);
router.get("/:id", getInsuranceById);
router.put("/:id", verifyToken, verifyRole("Super Admin"), updateInsurance);
router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteInsurance);

module.exports = router;
