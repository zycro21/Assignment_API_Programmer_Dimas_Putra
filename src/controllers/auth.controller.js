const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const { successResponse, errorResponse } = require("../utils/response");
const { isValidEmail } = require("../utils/validator");
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updateProfileImage,
  getProfileImageByEmail,
} = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;

    // validasi email
    if (!isValidEmail(email)) {
      return errorResponse(res, 102, "Parameter email tidak sesuai format");
    }

    // validasi password
    if (!password || password.length < 8) {
      return errorResponse(res, 102, "Password minimal 8 karakter");
    }

    await registerUser({
      email,
      first_name,
      last_name,
      password,
    });

    return successResponse(res, "Registrasi berhasil silahkan login");
  } catch (err) {
    console.error(err);

    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return errorResponse(res, 102, "Email sudah terdaftar");
    }

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validasi email
    if (!isValidEmail(email)) {
      return errorResponse(res, 102, "Parameter email tidak sesuai format");
    }

    // validasi password
    if (!password || password.length < 8) {
      return errorResponse(res, 102, "Password minimal 8 karakter");
    }

    // login process
    const user = await loginUser({
      email,
      password,
    });

    // generate JWT
    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      },
    );

    return successResponse(res, "Login Sukses", {
      token,
    });
  } catch (err) {
    console.error(err);

    if (err.message === "INVALID_CREDENTIALS") {
      return errorResponse(res, 103, "Username atau password salah", 401);
    }

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const profile = async (req, res) => {
  try {
    // ambil email dari JWT payload
    const email = req.user.email;

    const user = await getProfile(email);

    return successResponse(res, "Sukses", user);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const updateProfileController = async (req, res) => {
  try {
    // ambil email dari JWT
    const email = req.user.email;

    const { first_name, last_name } = req.body;

    // minimal salah satu field dikirim
    if (!first_name && !last_name) {
      return errorResponse(res, 102, "first_name atau last_name wajib diisi");
    }

    const updatedUser = await updateProfile({
      email,
      first_name,
      last_name,
    });

    return successResponse(res, "Update Profile berhasil", updatedUser);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

const uploadProfileImageController = async (req, res) => {
  try {
    const email = req.user.email;

    // cek file upload
    if (!req.file) {
      return errorResponse(res, 102, "Format Image tidak sesuai");
    }

    // ambil image lama
    const oldProfileImage = await getProfileImageByEmail(email);

    // buat url image baru
    const profileImageUrl = `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`;

    // update database
    const updatedUser = await updateProfileImage({
      email,
      profile_image: profileImageUrl,
    });

    // hapus image lama jika ada
    if (oldProfileImage) {
      const oldFileName = oldProfileImage.split("/").pop();

      const oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        oldFileName,
      );

      // cek file exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return successResponse(res, "Update Profile Image berhasil", updatedUser);
  } catch (err) {
    console.error(err);

    return errorResponse(res, 500, "Internal server error", 500);
  }
};

module.exports = {
  register,
  login,
  profile,
  updateProfileController,
  uploadProfileImageController,
};
