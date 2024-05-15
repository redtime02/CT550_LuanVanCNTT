const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-user", authMiddleware, authController.getUserById);

router.get("/:id", authController.getUser);

router.put("/put-user", authMiddleware, authController.updateUser);

router.post("/upload", authMiddleware, authController.uploadImage);

router.post("/:id/upload", authController.uploadCollectorAvatar);
// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Lấy danh sách người dùng
router.get("/users", authController.getUsers);

router.get("/users/role-user", authController.getUsersWithUserRole);

router.get("/users/role-collector", authController.getUsersWithCollectorRole);

router.post("/create", authController.createCollector);

router.put("/block/:id", authController.blockUser);

router.put("/un-block/:id", authController.unblockUser);

router.put("/:id", authController.updateCollector);

router.delete("/:id", authController.deleteUser);

module.exports = router;
