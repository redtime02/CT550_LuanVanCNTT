const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware authentication
const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded token:", decoded);

      // Lấy thông tin người dùng từ decoded và lưu vào req.user
      const user = await User.findById(decoded?.userId);
      console.log("User:", user);

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;

      // Tiếp tục xử lý tiếp theo
      next();
    } catch (error) {
      console.log("Authentication error:", error);
      return res.status(401).json({ error: "Token không hợp lệ" });
    }
  } else {
    return res.status(401).json({ error: "Không có mã token" });
  }
};

module.exports = authMiddleware;
