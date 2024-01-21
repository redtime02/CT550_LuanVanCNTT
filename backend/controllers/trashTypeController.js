const TrashType = require("../models/TrashType");

// Thêm loại vật liệu tái chế
async function createTrashType(req, res) {
  try {
    const { name } = req.body;

    const newTrashType = new TrashType({
      name,
    });

    await newTrashType.save();

    res.status(201).json({ message: "Trash type created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create trash type" });
  }
}

// Sửa loại vật liệu tái chế
async function updateTrashType(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedTrashType = await TrashType.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedTrashType) {
      return res.status(404).json({ message: "Trash type not found" });
    }

    res.json({ message: "Trash type updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update trash type" });
  }
}

// Xóa loại vật liệu tái chế
async function deleteTrashType(req, res) {
  try {
    const { id } = req.params;

    const deletedTrashType = await TrashType.findByIdAndDelete(id);

    if (!deletedTrashType) {
      return res.status(404).json({ message: "Trash type not found" });
    }

    res.json({ message: "Trash type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete trash type" });
  }
}

// Hiển thị danh sách loại vật liệu tái chế
async function getTrashTypes(req, res) {
  try {
    const trashTypes = await TrashType.find();

    res.json(trashTypes);
  } catch (error) {
    res.status(500).json({ message: "Failed to get trash types" });
  }
}

module.exports = {
  createTrashType,
  updateTrashType,
  deleteTrashType,
  getTrashTypes,
};
