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
    const { name, latitude, longitude, trashTypeId, otherDetails, weightMax } =
      req.body;

    const location = new Location({
      name,
      latitude,
      longitude,
      markedBy: _id,
      weightMax,
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
    user.markCount += 1;
    await user.save();

    res.json({
      message: "Recycling spot marked successfully",
      locationId: location._id,
    });
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
    const { point, weight } = req.body;

    const location = await Location.findById(id).populate("markedBy");

    if (!location) {
      return res.status(404).json({ message: "Recycling spot not found" });
    }

    const locationDetail = await LocationDetail.findOne({ locationId: id });

    if (!locationDetail) {
      return res.status(404).json({ message: "Recycling spot not found" });
    }

    location.isCollected = true;
    location.collector = _id;
    location.isOutdated = false;
    locationDetail.weight = weight;
    await location.save();
    await locationDetail.save();

    // Tìm người dùng dựa trên giá trị markedBy.name
    const user = await User.findOne({ name: location.markedBy.name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cộng điểm point cho người dùng
    user.point += point;
    await user.save();

    const collector = await User.findById(_id);
    collector.collectCount += 1;
    await collector.save();

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
    const trashTypeIds = locationDetail.trashTypeId.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // Tìm tất cả các TrashType tương ứng với trashTypeIds
    const trashTypes = await TrashType.find({ _id: { $in: trashTypeIds } });

    if (!trashTypes || trashTypes.length === 0) {
      return res.status(404).json({ message: "Trash types not found" });
    }

    // Thu thập tên của các TrashType
    const trashTypeNames = trashTypes.map((trashType) => trashType.name);

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
    const location = await Location.findById(id).populate("markedBy");

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

async function getCollectedLocations(req, res) {
  try {
    // Truy vấn tất cả các địa điểm đã thu thập từ cơ sở dữ liệu
    const { _id } = req.user;
    const collectedLocations = await Location.find({
      isCollected: true,
      collector: _id,
    });

    // Trả về danh sách các địa điểm đã thu thập dưới dạng JSON
    res.json(collectedLocations);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch collected locations" });
  }
}

async function getUncollectedLocations(req, res) {
  try {
    // Truy vấn tất cả các địa điểm đã thu thập từ cơ sở dữ liệu
    const uncollectedLocations = await Location.find({
      isCollected: false,
    }).populate("collectingBy");

    // Trả về danh sách các địa điểm đã thu thập dưới dạng JSON
    res.json(uncollectedLocations);
  } catch (error) {
    console.log(error);
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch uncollected locations" });
  }
}

async function updateCollectingBy(req, res) {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const { collectingLatitude, collectingLongitude } = req.body;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Update the collectingBy field with the current user ID
    location.collectingBy = _id;
    location.collectingLatitude = collectingLatitude;
    location.collectingLongitude = collectingLongitude;
    location.isOutdated = false;
    location.outdatedCollector = null;
    await location.save();

    res.json({ message: "Collecting status updated successfully", location });

    // Set timeout to automatically cancel selection after a certain time (e.g., 30 minutes)
    const maxElapsedTimeInMilliseconds = 10000 * 6 * 10; // 30 minutes
    setTimeout(async () => {
      // Check if the location is still selected by the same user
      const updatedLocation = await Location.findById(id);
      if (updatedLocation.collectingBy.equals(_id)) {
        // If still selected by the same user, cancel the selection
        updatedLocation.collectingBy = null;
        updatedLocation.collectingLatitude = null;
        updatedLocation.collectingLongitude = null;
        updatedLocation.isOutdated = true;
        updatedLocation.outdatedCollector = _id;
        await updatedLocation.save();
        console.log(`Location ${id} has been automatically unselected.`);
      }
    }, maxElapsedTimeInMilliseconds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update collecting status" });
  }
}

async function getCollectedLocationsWithDetails(req, res) {
  try {
    // Sử dụng phương pháp aggregate để ghép thông tin từ cả hai model và lọc các địa điểm đã thu thập
    const collectedLocationsWithDetails = await Location.aggregate([
      {
        $match: {
          isCollected: true,
        },
      },
      {
        $lookup: {
          from: "locationdetails",
          localField: "_id",
          foreignField: "locationId",
          as: "details",
        },
      },
      {
        $unwind: {
          path: "$details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "markedBy",
          foreignField: "_id",
          as: "markedBy",
        },
      },
      {
        $unwind: {
          path: "$markedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "collector",
          foreignField: "_id",
          as: "collector",
        },
      },
      {
        $unwind: {
          path: "$collector",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          latitude: 1,
          longitude: 1,
          markedBy: {
            _id: "$markedBy._id",
            name: "$markedBy.name",
          },
          images: 1,
          imageUrl: 1,
          isCollected: 1,
          collector: {
            _id: "$collector._id",
            name: "$collector.name",
          },
          collectingBy: 1,
          "details.trashTypeId": 1,
          "details.weight": 1,
          "details.otherDetails": 1,
        },
      },
    ]);

    // Trả về danh sách các địa điểm đã thu thập với thông tin chi tiết
    res.json(collectedLocationsWithDetails);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      message: "Failed to fetch collected location list with details",
    });
  }
}

async function getMonthlyCollectedWeight(req, res) {
  try {
    // Sử dụng phương pháp aggregate để lấy tổng trọng lượng đã thu thập theo tháng
    const monthlyCollectedWeight = await Location.aggregate([
      // Lọc các bản ghi đã thu thập
      {
        $match: {
          isCollected: true,
        },
      },
      {
        $lookup: {
          from: "locationdetails",
          localField: "_id",
          foreignField: "locationId",
          as: "details",
        },
      },
      {
        $unwind: {
          path: "$details",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Nhóm các bản ghi theo tháng và tính tổng trọng lượng
      {
        $group: {
          _id: { $month: "$createdAt" }, // Nhóm theo tháng
          totalWeight: { $sum: "$details.weight" }, // Tính tổng trọng lượng
        },
      },
      // Sắp xếp kết quả theo tháng
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Trả về kết quả
    res.json(monthlyCollectedWeight);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      message: "Failed to fetch monthly collected weight",
    });
  }
}

async function getTotalCollectedWeight(req, res) {
  try {
    // Sử dụng phương pháp aggregate để tính tổng trọng lượng các địa điểm đã thu thập
    const totalCollectedWeight = await Location.aggregate([
      // Lọc các bản ghi đã thu thập
      {
        $match: {
          isCollected: true,
        },
      },
      // Ghép thông tin từ collection "locationdetails"
      {
        $lookup: {
          from: "locationdetails",
          localField: "_id",
          foreignField: "locationId",
          as: "details",
        },
      },
      // Mở rộng mảng "details"
      {
        $unwind: {
          path: "$details",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Nhóm các bản ghi và tính tổng trọng lượng
      {
        $group: {
          _id: null, // Nhóm tất cả các bản ghi thành một nhóm
          totalWeight: { $sum: "$details.weight" }, // Tính tổng trọng lượng
        },
      },
    ]);

    // Trả về kết quả tổng trọng lượng
    res.json(totalCollectedWeight[0]); // Vì kết quả trả về là một mảng, nên lấy phần tử đầu tiên
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      message: "Failed to fetch total collected weight",
    });
  }
}

async function getCountCollectedLocations(req, res) {
  try {
    // Sử dụng phương thức countDocuments để đếm số lượng địa điểm đã thu thập
    const totalCollectedLocations = await Location.countDocuments({
      isCollected: true,
    });

    // Trả về số lượng địa điểm đã thu thập
    res.json({ totalCollectedLocations });
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      message: "Failed to fetch total collected locations",
    });
  }
}

async function getUncollectedLocationsByUser(req, res) {
  try {
    const { _id } = req.user;

    // Tìm tất cả các địa điểm chưa được thu thập với markedBy là ID của người dùng
    const uncollectedLocations = await Location.find({
      isCollected: false,
      markedBy: _id,
      collectingBy: null,
    });

    // Nếu không có địa điểm nào, trả về một mảng rỗng
    if (!uncollectedLocations.length) {
      return res.json([]);
    }

    // Mảng chứa các địa điểm với thông tin LocationDetail
    const uncollectedLocationsWithDetails = [];

    // Lặp qua từng địa điểm chưa được thu thập
    for (const location of uncollectedLocations) {
      // Tìm thông tin LocationDetail tương ứng với locationId của từng địa điểm
      const locationDetail = await LocationDetail.findOne({
        locationId: location._id,
      });

      // Nếu không tìm thấy LocationDetail, bỏ qua và tiếp tục với địa điểm tiếp theo
      if (!locationDetail) {
        continue;
      }

      // Ghép thông tin LocationDetail vào địa điểm
      const locationWithDetails = {
        ...location.toObject(),
        details: locationDetail.toObject(),
      };

      // Thêm địa điểm với thông tin LocationDetail vào mảng kết quả
      uncollectedLocationsWithDetails.push(locationWithDetails);
    }

    // Trả về danh sách các địa điểm chưa được thu thập với thông tin LocationDetail
    res.json(uncollectedLocationsWithDetails);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch uncollected locations" });
  }
}

async function getCountCollectedLocations(req, res) {
  try {
    // Sử dụng phương thức countDocuments để đếm số lượng địa điểm đã thu thập
    const totalCollectedLocations = await Location.countDocuments({
      isCollected: true,
    });

    // Trả về số lượng địa điểm đã thu thập
    res.json({ totalCollectedLocations });
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      message: "Failed to fetch total collected locations",
    });
  }
}

async function getCollectedLocationsByUser(req, res) {
  try {
    const { _id } = req.user;

    // Tìm tất cả các địa điểm chưa được thu thập với markedBy là ID của người dùng
    const collectedLocations = await Location.find({
      isCollected: true,
      markedBy: _id,
    });

    // Nếu không có địa điểm nào, trả về một mảng rỗng
    if (!collectedLocations.length) {
      return res.json([]);
    }

    // Mảng chứa các địa điểm với thông tin LocationDetail
    const collectedLocationsWithDetails = [];

    // Lặp qua từng địa điểm chưa được thu thập
    for (const location of collectedLocations) {
      // Tìm thông tin LocationDetail tương ứng với locationId của từng địa điểm
      const locationDetail = await LocationDetail.findOne({
        locationId: location._id,
      });

      // Nếu không tìm thấy LocationDetail, bỏ qua và tiếp tục với địa điểm tiếp theo
      if (!locationDetail) {
        continue;
      }

      // Ghép thông tin LocationDetail vào địa điểm
      const locationWithDetails = {
        ...location.toObject(),
        details: locationDetail.toObject(),
      };

      // Thêm địa điểm với thông tin LocationDetail vào mảng kết quả
      collectedLocationsWithDetails.push(locationWithDetails);
    }

    // Trả về danh sách các địa điểm chưa được thu thập với thông tin LocationDetail
    res.json(collectedLocationsWithDetails);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch uncollected locations" });
  }
}

async function getCollectingLocationsByUser(req, res) {
  try {
    const { _id } = req.user;

    // Tìm tất cả các địa điểm chưa được thu thập với markedBy là ID của người dùng
    const uncollectedLocations = await Location.find({
      isCollected: false,
      markedBy: _id,
    }).populate("collectingBy");

    // Nếu không có địa điểm nào, trả về một mảng rỗng
    if (!uncollectedLocations.length) {
      return res.json([]);
    }

    // Mảng chứa các địa điểm chưa được thu thập với thông tin LocationDetail
    const uncollectedLocationsWithDetails = [];

    // Lặp qua từng địa điểm chưa được thu thập
    for (const location of uncollectedLocations) {
      // Kiểm tra nếu collectingBy là null
      if (location.collectingBy) {
        // Tìm thông tin LocationDetail tương ứng với locationId của từng địa điểm
        const locationDetail = await LocationDetail.findOne({
          locationId: location._id,
        });

        // Nếu không tìm thấy LocationDetail, bỏ qua và tiếp tục với địa điểm tiếp theo
        if (!locationDetail) {
          continue;
        }

        // Ghép thông tin LocationDetail vào địa điểm
        const locationWithDetails = {
          ...location.toObject(),
          details: locationDetail.toObject(),
        };

        // Thêm địa điểm với thông tin LocationDetail vào mảng kết quả
        uncollectedLocationsWithDetails.push(locationWithDetails);
      }
    }

    // Trả về danh sách các địa điểm chưa được thu thập với thông tin LocationDetail
    res.json(uncollectedLocationsWithDetails);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch uncollected locations" });
  }
}

async function getOutdatedLocations(req, res) {
  try {
    const { _id } = req.user;
    // Truy vấn tất cả các địa điểm có trường isOutdated là true từ cơ sở dữ liệu
    const outdatedLocations = await Location.find({
      isOutdated: true,
      outdatedCollector: _id,
    });

    // Trả về danh sách các địa điểm với isOutdated là true dưới dạng JSON
    res.json(outdatedLocations);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch outdated locations" });
  }
}

async function getUncollectedLocationsByAdmin(req, res) {
  try {
    // Truy vấn tất cả các địa điểm đã thu thập từ cơ sở dữ liệu
    const uncollectedLocations = await Location.find({
      isCollected: false,
    })
      .populate("collectingBy")
      .populate("markedBy");

    // Trả về danh sách các địa điểm đã thu thập dưới dạng JSON
    res.json(uncollectedLocations);
  } catch (error) {
    console.log(error);
    // Xử lý lỗi nếu có
    res.status(500).json({ message: "Failed to fetch uncollected locations" });
  }
}

// async function getLocationByIdByAdmin(req, res) {
//   try {
//     const { id } = req.params;

//     // Tìm địa điểm dựa trên ID
//     const location = await Location.findById(id).populate("markedBy");

//     if (!location) {
//       return res.status(404).json({ message: "Location not found" });
//     }

//     // Trả về thông tin của địa điểm
//     res.json(location);
//   } catch (error) {
//     // Xử lý lỗi nếu có
//     res.status(500).json({ message: "Failed to fetch location by ID" });
//   }
// }

async function deleteLocation(req, res) {
  try {
    const { id } = req.params;

    // Tìm và xóa địa điểm dựa trên ID
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json({ message: "Location deleted successfully", deletedLocation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete location" });
  }
}

module.exports = {
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
  // getLocationByIdByAdmin,
};
