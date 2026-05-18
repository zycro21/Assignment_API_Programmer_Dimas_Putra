const express = require("express");

const {
  getBannerController,
  getServicesController,
} = require("../controllers/moduleinformation.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/banner", getBannerController);
router.get("/services", authMiddleware, getServicesController);

module.exports = router;
