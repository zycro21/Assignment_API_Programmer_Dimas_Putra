const { successResponse, errorResponse } = require("../utils/response");
const { isValidAmount } = require("../utils/validator");
const {
  getBalanceByEmail,
  topUpBalance,
  createTransaction,
  getTransactionHistory,
} = require("../services/transaction.service");

const getBalanceController = async (req, res) => {
  try {
    // ambil email dari JWT
    const email = req.user.email;

    // ambil balance user
    const balanceData = await getBalanceByEmail(email);

    return successResponse(res, "Get Balance Berhasil", balanceData);
  } catch (err) {
    console.error(err);

    if (err.message === "BALANCE_NOT_FOUND") {
      return errorResponse(res, 404, "Balance tidak ditemukan", 404);
    }

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const topUpController = async (req, res) => {
  try {
    // ambil email dari JWT
    const email = req.user.email;

    const { top_up_amount } = req.body;

    // validasi amount
    if (!isValidAmount(top_up_amount)) {
      return errorResponse(
        res,
        102,
        "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      );
    }

    // proses topup
    const updatedBalance = await topUpBalance({
      email,
      amount: top_up_amount,
    });

    return successResponse(res, "Top Up Balance berhasil", updatedBalance);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const transactionController = async (req, res) => {
  try {
    // ambil email dari JWT
    const email = req.user.email;

    const { service_code } = req.body;

    // validasi service_code
    if (!service_code) {
      return errorResponse(res, 102, "Service atau Layanan tidak ditemukan");
    }

    // proses transaksi
    const transaction = await createTransaction({
      email,
      service_code,
    });

    return successResponse(res, "Transaksi berhasil", transaction);
  } catch (err) {
    console.error(err);

    if (err.message === "SERVICE_NOT_FOUND") {
      return errorResponse(res, 102, "Service atau Layanan tidak ditemukan");
    }

    if (err.message === "INSUFFICIENT_BALANCE") {
      return errorResponse(res, 102, "Balance tidak mencukupi");
    }

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const getTransactionHistoryController = async (req, res) => {
  try {
    // ambil email dari JWT
    const email = req.user.email;

    // ambil query params
    const offset = Number(req.query.offset) || 0;

    const limit =
      req.query.limit !== undefined ? Number(req.query.limit) : undefined;

    // validasi offset
    if (offset < 0 || isNaN(offset)) {
      return errorResponse(res, 102, "Parameter offset tidak valid");
    }

    // validasi limit
    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return errorResponse(res, 102, "Parameter limit tidak valid");
    }

    // ambil history transaksi
    const histories = await getTransactionHistory({
      email,
      offset,
      limit,
    });

    return successResponse(res, "Get History Berhasil", histories);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

module.exports = {
  getBalanceController,
  topUpController,
  transactionController,
  getTransactionHistoryController,
};
