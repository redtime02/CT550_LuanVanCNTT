const multer = require("multer");
const BonusItem = require("../models/BonusItem");
const upload = require("../middlewares/multerMiddleware");

async function addBonusItem(req, res) {
  try {
    const { name, description, point } = req.body;

    const bonusItem = new BonusItem({
      name,
      description,
      point,
    });
    await bonusItem.save();

    res.json({ message: "Bonus item added successfully", bonusItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add bonus item" });
  }
}

async function uploadImage(req, res) {
  try {
    const { id } = req.params;

    const bonusItem = await BonusItem.findById(id);

    if (!bonusItem) {
      return res.status(404).json({ message: "Bonus item not found" });
    }

    // Sử dụng middleware multer để xử lý tệp tin hình ảnh
    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Trả về đường dẫn của tệp tin hình ảnh đã được tải lên
      const imagePath = req.file.path;

      // Cập nhật đường dẫn hình ảnh cho vật thưởng
      bonusItem.image = imagePath;
      bonusItem.save();

      res.json({
        message: "Image uploaded and bonus item updated successfully",
        imagePath,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
}

async function updateBonusItem(req, res) {
  try {
    const { id } = req.params;
    const { name, description, point } = req.body;

    const bonusItem = await BonusItem.findById(id);

    if (!bonusItem) {
      return res.status(404).json({ message: "Bonus item not found" });
    }

    bonusItem.name = name;
    bonusItem.description = description;
    bonusItem.point = point;
    await bonusItem.save();

    res.json({ message: "Bonus item updated successfully", bonusItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update bonus item" });
  }
}

async function deleteBonusItem(req, res) {
  try {
    const { id } = req.params;

    const bonusItem = await BonusItem.findById(id);

    if (!bonusItem) {
      return res.status(404).json({ message: "Bonus item not found" });
    }

    await BonusItem.findByIdAndDelete(id);
    // console.log(bonusItem);

    res.json({ message: "Bonus item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete bonus item" });
  }
}

async function getBonusItems(req, res) {
  try {
    const bonusItems = await BonusItem.find();

    res.json({ bonusItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve bonus items" });
  }
}

async function getBonusItemById(req, res) {
  try {
    const { id } = req.params;

    const bonusItem = await BonusItem.findById(id);
    res.json({ bonusItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve bonus items" });
  }
}

module.exports = {
  addBonusItem,
  uploadImage,
  updateBonusItem,
  deleteBonusItem,
  getBonusItems,
  getBonusItemById,
};
