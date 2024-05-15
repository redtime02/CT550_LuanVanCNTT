const express = require("express");
const router = express.Router();
const {
  markLocation,
  addImage,
  confirmCollected,
  getLocations,
  findTrashTypeNameByLocationId,
  getLocationById,
  getCollectedLocations,
  getUncollectedLocations,
  updateCollectingBy,
  getCollectedLocationsWithDetails,
  getMonthlyCollectedWeight,
  getTotalCollectedWeight,
  getCountCollectedLocations,
  getUncollectedLocationsByUser,
  getCollectedLocationsByUser,
  getCollectingLocationsByUser,
  getOutdatedLocations,
  getUncollectedLocationsByAdmin,
  deleteLocation,
} = require("../controllers/locationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/monthly", getMonthlyCollectedWeight);

router.get("/uncollect-by", authMiddleware, getUncollectedLocationsByUser);

router.get("/get-collecting-by", authMiddleware, getCollectingLocationsByUser);

router.get("/collect-by", authMiddleware, getCollectedLocationsByUser);

router.get("/out-dated", authMiddleware, getOutdatedLocations);

router.get("/total", getTotalCollectedWeight);

router.get("/count", getCountCollectedLocations);

router.get("/collected", authMiddleware, getCollectedLocations);

router.get("/uncollected", getUncollectedLocations);

// Đánh dấu địa điểm nhặt ve chai
router.post("/mark", authMiddleware, markLocation);

// Thêm hình ảnh vào địa điểm nhặt ve chai
router.post("/:id/images", authMiddleware, addImage);

// Xác nhận người đã nhặt ve chai tại địa điểm đánh dấu
router.patch("/:id/confirm", authMiddleware, confirmCollected);

// Danh sách địa điểm ve chai
router.get("/", getLocations);

router.get("/un-location", getUncollectedLocationsByAdmin);

// router.get("/un-location/:id", getLocationByIdByAdmin);

router.get("/:locationId", findTrashTypeNameByLocationId);

router.get("/mark/:id", getLocationById);

router.patch("/:id/collecting", authMiddleware, updateCollectingBy);

router.delete("/:id", deleteLocation);

module.exports = router;
