const express = require("express");
const router = express.Router();

const {
  createCurrency,
  getCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency,
} = require("../../../controllers/admin/currency/currencyController");

const { verifyRole, verifyToken } = require("../../../middleware/auth");

router.post("/", verifyToken, verifyRole("Super Admin"), createCurrency);

router.get("/", getCurrencies);

router.get("/:id", getCurrency);

router.put("/:id", verifyToken, verifyRole("Super Admin"), updateCurrency);

router.delete("/:id", verifyToken, verifyRole("Super Admin"), deleteCurrency);

module.exports = router;
