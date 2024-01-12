const express = require("express");
const router = express.Router();
const {
  markLocation,
  addImage,
  confirmCollected,
} = require("../controllers/locationController");

// Đánh dấu địa điểm nhặt ve chai
router.post("/mark", markLocation);

// Thêm hình ảnh vào địa điểm nhặt ve chai
router.post("/:id/images", addImage);

// Xác nhận người đã nhặt ve chai tại địa điểm đánh dấu
router.patch("/:id/confirm", confirmCollected);

module.exports = router;
