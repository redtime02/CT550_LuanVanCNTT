const express = require("express");
const router = express.Router();
const {
  markLocation,
  addImage,
  confirmCollected,
  getLocations,
  findTrashTypeNameByLocationId,
  getLocationById
} = require("../controllers/locationController");
const authMiddleware = require("../middlewares/authMiddleware");

// Đánh dấu địa điểm nhặt ve chai
router.post("/mark", authMiddleware, markLocation);

// Thêm hình ảnh vào địa điểm nhặt ve chai
router.post("/:id/images", authMiddleware, addImage);

// Xác nhận người đã nhặt ve chai tại địa điểm đánh dấu
router.patch("/:id/confirm", authMiddleware, confirmCollected);

// Danh sách địa điểm ve chai
router.get("/", getLocations)

router.get("/:locationId", findTrashTypeNameByLocationId)

router.get('/mark/:id', getLocationById);

module.exports = router;
