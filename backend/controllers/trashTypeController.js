const TrashType = require("../models/TrashType");

// Thêm loại vật liệu tái chế
async function createTrashType(req, res) {
  try {
    const { name, point } = req.body;

    const newTrashType = new TrashType({
      name,
      point,
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
    const { name, point } = req.body;

    const updatedTrashType = await TrashType.findByIdAndUpdate(
      id,
      { name, point },
      { new: true }
    );

    if (!updatedTrashType) {
      return res.status(404).json({ message: "Trash type not found" });
    }

    res.json({ message: "Trash type updated successfully", updatedTrashType });
  } catch (error) {
    console.error("Error updating trash type:", error);
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

// Tìm tên TrashType dựa trên id và trả về JSON response
async function findTrashTypeNameById(req, res) {
  try {
    const { id } = req.params;
    const trashType = await TrashType.findById(id);
    if (!trashType) {
      return res.status(404).json({ message: "TrashType not found" });
    }
    return res.json({ name: trashType.name });
  } catch (error) {
    console.error("Error finding TrashType name by id:", error);
    return res.status(500).json({ message: "Failed to find TrashType name" });
  }
}

async function findTrashTypeById(req, res) {
  try {
    const { id } = req.params;
    const trashType = await TrashType.findById(id);
    if (!trashType) {
      return res.status(404).json({ message: "TrashType not found" });
    }
    return res.json(trashType);
  } catch (error) {
    console.error("Error finding TrashType by id:", error);
    return res.status(500).json({ message: "Failed to find TrashType" });
  }
}

module.exports = {
  createTrashType,
  updateTrashType,
  deleteTrashType,
  getTrashTypes,
  findTrashTypeNameById,
  findTrashTypeById,
};
