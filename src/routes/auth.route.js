const express = require("express");

const {
  register,
  login,
  profile,
  updateProfileController,
  uploadProfileImageController,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/registration", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.put("/profile/update", authMiddleware, updateProfileController);
router.put(
  "/profile/image",
  authMiddleware,
  upload,
  uploadProfileImageController,
);

module.exports = router;
