const Location = require("../models/Location");
const upload = require("../middlewares/multerMiddleware");
const LocationDetail = require("../models/LocationDetail");
const User = require("../models/User");

// Đánh dấu địa điểm nhặt ve chai
async function markLocation(req, res) {
  try {
    const { name, latitude, longitude, markedBy, trashTypeId, otherDetails } =
      req.body;

    const location = new Location({
      name,
      latitude,
      longitude,
      markedBy,
    });
    await location.save();

    const locationDetail = new LocationDetail({
      locationId: location._id,
      trashTypeId,
      otherDetails,
    });
    await locationDetail.save();

    // Tìm người dùng tương ứng với markedBy
    const user = await User.findById(markedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Thêm 50 điểm cho người dùng
    user.point += 50;
    await user.save();

    res.json({ message: "Recycling spot marked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to mark recycling spot" });
  }
}

// Thêm hình ảnh vào địa điểm nhặt ve chai
async function addImage(req, res) {
  try {
    const { id } = req.params;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: "Recycling spot not found" });
    }

    // Sử dụng multer middleware để xử lý tải lên nhiều hình ảnh
    upload.array("images")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      const imagePaths = req.files.map((file) => file.path); // Lưu trữ đường dẫn tới các tệp tin hình ảnh đã tải lên

      location.images.push(...imagePaths);
      location.save();

      res.json({ message: "Images added successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add images" });
  }
}

// Xác nhận người đã nhặt ve chai tại địa điểm đánh dấu
async function confirmCollected(req, res) {
  try {
    const { id } = req.params;
    const { collector } = req.body;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: "Recycling spot not found" });
    }

    location.isCollected = true;
    location.collector = collector;
    await location.save();

    res.json({ message: "Recycling spot marked as collected", collector });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark recycling spot as collected" });
  }
}

module.exports = {
  markLocation,
  addImage,
  confirmCollected,
};
