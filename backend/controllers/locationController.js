const Location = require("../models/Location");
const upload = require("../middlewares/multerMiddleware");
const LocationDetail = require("../models/LocationDetail");
const User = require("../models/User");
const TrashType = require("../models/TrashType");
const mongoose = require("mongoose"); 

// Đánh dấu địa điểm nhặt ve chai
async function markLocation(req, res) {
  try {
    const { _id } = req.user;
    console.log(_id);
    const { name, latitude, longitude, trashTypeId, otherDetails } = req.body;

    const location = new Location({
      name,
      latitude,
      longitude,
      markedBy: _id,
    });
    await location.save();

    const locationDetail = new LocationDetail({
      locationId: location._id,
      trashTypeId,
      otherDetails,
    });
    await locationDetail.save();

    // Tìm người dùng tương ứng với markedBy
    const user = await User.findById(_id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Thêm 50 điểm cho người dùng
    user.point += 50;
    await user.save();

    res.json({ message: "Recycling spot marked successfully", locationId: location._id });
    console.log(locationDetail);
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

      location.imageUrl = `http://192.168.100.66/api/images/${imagePaths}`;

      location.save();

      res.json({ message: "Images added successfully", location });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add images" });
  }
}

// Xác nhận người đã nhặt ve chai tại địa điểm đánh dấu
async function confirmCollected(req, res) {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { point } = req.body;

    const location = await Location.findById(id).populate('markedBy');

    if (!location) {
      return res.status(404).json({ message: "Recycling spot not found" });
    }

    location.isCollected = true;
    location.collector = _id;
    await location.save();

    // Tìm người dùng dựa trên giá trị markedBy.name
    const user = await User.findOne({ name: location.markedBy.name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Cộng điểm point cho người dùng
    user.point += point;
    await user.save();

    res.json({ message: "Recycling spot marked as collected", _id, location });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to mark recycling spot as collected" });
  }
}

// Hàm lấy danh sách các địa điểm
async function getLocations(req, res) {
  try {
    // Truy vấn tất cả các địa điểm từ cơ sở dữ liệu
    const locations = await Location.find();

    // Trả về danh sách các địa điểm dưới dạng JSON
    res.json(locations);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch locations" });
  }
}

// Hàm tìm trashTypeId qua locationId và trả về tên của TrashType
async function findTrashTypeNameByLocationId(req, res) {
  try {
    const { locationId } = req.params;

    // Tìm đối tượng LocationDetail dựa trên locationId
    const locationDetail = await LocationDetail.findOne({ locationId });

    if (!locationDetail) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Chuyển đổi mảng trashTypeId thành mảng ObjectId
    const trashTypeIds = locationDetail.trashTypeId.map(id => new mongoose.Types.ObjectId(id));

    // Tìm tất cả các TrashType tương ứng với trashTypeIds
    const trashTypes = await TrashType.find({ _id: { $in: trashTypeIds } });

    if (!trashTypes || trashTypes.length === 0) {
      return res.status(404).json({ message: "Trash types not found" });
    }

    // Thu thập tên của các TrashType
    const trashTypeNames = trashTypes.map(trashType => trashType.name);

    // Trả về tên của các TrashType
    res.json(trashTypeNames);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to find trash type names by locationId");
  }
}

// Thêm hàm tìm location qua id
async function getLocationById(req, res) {
  try {
    const { id } = req.params;

    // Tìm địa điểm dựa trên ID
    const location = await Location.findById(id).populate('markedBy');

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Trả về thông tin của địa điểm
    res.json(location);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch location by ID" });
  }
}


module.exports = {
  markLocation,
  addImage,
  confirmCollected,
  getLocations,
  findTrashTypeNameByLocationId,
  getLocationById
};
