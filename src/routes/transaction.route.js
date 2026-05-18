const express = require("express");

const {
  getBalanceController,
  topUpController,
  transactionController,
  getTransactionHistoryController,
} = require("../controllers/transaction.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/balance", authMiddleware, getBalanceController);
router.post("/topup", authMiddleware, topUpController);
router.post("/transaction", authMiddleware, transactionController);
router.get(
  "/transaction/history",
  authMiddleware,
  getTransactionHistoryController,
);

module.exports = router;
