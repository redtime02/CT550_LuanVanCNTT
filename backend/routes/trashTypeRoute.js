const express = require("express");
const router = express.Router();
const trashTypeController = require("../controllers/trashTypeController");

// Thêm loại vật liệu tái chế
router.post("/", trashTypeController.createTrashType);

// Sửa loại vật liệu tái chế
router.put("/:id", trashTypeController.updateTrashType);

// Xóa loại vật liệu tái chế
router.delete("/:id", trashTypeController.deleteTrashType);

// Hiển thị danh sách loại vật liệu tái chế
router.get("/", trashTypeController.getTrashTypes);

// Route để tìm tên TrashType dựa trên id
router.get("/:id", trashTypeController.findTrashTypeNameById);

router.get("/waste/:id", trashTypeController.findTrashTypeById);

module.exports = router;
