const jwt = require("jsonwebtoken");

const { errorResponse } = require("../utils/response");

const authMiddleware = async (req, res, next) => {
  try {
    // ambil header authorization
    const authHeader = req.headers.authorization;

    // cek bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        108,
        "Token tidak tidak valid atau kadaluwarsa",
        401,
      );
    }

    // ambil token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // simpan payload ke request
    req.user = decoded;

    next();
  } catch (err) {
    return errorResponse(
      res,
      108,
      "Token tidak tidak valid atau kadaluwarsa",
      401,
    );
  }
};

module.exports = authMiddleware;