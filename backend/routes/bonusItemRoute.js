const express = require("express");
const router = express.Router();
const {
  addBonusItem,
  uploadImage,
  updateBonusItem,
  deleteBonusItem,
  getBonusItems,
} = require("../controllers/bonusItemController");

// Định tuyến thêm vật thưởng
router.post("/", addBonusItem);

// Định tuyến sửa vật thưởng
router.put("/:id", updateBonusItem);

// Định tuyến xóa vật thưởng
router.delete("/:id", deleteBonusItem);

// Định tuyến hiển thị danh sách vật thưởng
router.get("/", getBonusItems);

router.post("/:id/image", uploadImage);

module.exports = router;
