const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { errorResponse } = require("../utils/response");

// path folder upload
const uploadPath = "src/uploads/profile";

// cek folder upload
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // ambil extension file
    const ext = path.extname(file.originalname);

    // ambil nama file tanpa extension
    const originalName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // format tanggal
    const now = new Date();

    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    // hasil akhir nama file
    const uniqueName = `${originalName}_${timestamp}${ext}`;

    cb(null, uniqueName);
  },
});

// validasi format image
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_IMAGE_FORMAT"));
  }
};

// init multer
const multerUpload = multer({
  storage,
  fileFilter,
});

// custom middleware wrapper
const upload = (req, res, next) => {
  const singleUpload = multerUpload.single("file");

  singleUpload(req, res, (err) => {
    // handle invalid image
    if (err && err.message === "INVALID_IMAGE_FORMAT") {
      return errorResponse(res, 102, "Format Image tidak sesuai");
    }

    // handle multer error
    if (err) {
      return errorResponse(res, 500, "Internal server error", 500);
    }

    next();
  });
};

module.exports = upload;
