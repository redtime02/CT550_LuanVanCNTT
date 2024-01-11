const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Lấy danh sách người dùng
router.get("/users", authController.getUsers);

module.exports = router;
