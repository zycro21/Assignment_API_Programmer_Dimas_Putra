const express = require("express");
const authRoutes = require("./auth.route");
const moduleInformationRoutes = require("./moduleinformation.route");
const transactionRoutes = require("./transaction.route");

const router = express.Router();

router.use(authRoutes);
router.use(moduleInformationRoutes);
router.use(transactionRoutes);

router.get("/api", (req, res) => {
  res.json({
    message: "API running",
  });
});

module.exports = router;