const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserDetail = require("../models/UserDetail");
const mongoose = require("mongoose");
const upload = require("../middlewares/multerMiddleware");

async function register(req, res) {
  try {
    const { name, email, password, address, mobile } = req.body;

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      mobile,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to register user" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem người dùng tồn tại và mật khẩu có khớp không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Tạo token JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "72h",
    });
    console.log(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find(); // Lấy tất cả người dùng

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
}

async function getUsersWithUserRole(req, res) {
  try {
    // Sử dụng aggregate để kết hợp thông tin từ hai bảng User và UserDetail
    const usersWithUserRole = await User.aggregate([
      { $match: { role: "user" } }, // Chỉ lấy những người dùng có vai trò là "user"
      {
        $lookup: {
          from: "userdetails", // Tên của bảng UserDetail trong cơ sở dữ liệu
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } }, // Giải nén mảng userDetail và bảo tồn phần tử null nếu không có kết quả
    ]);

    res.json(usersWithUserRole);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users with user role" });
  }
}

async function getUsersWithCollectorRole(req, res) {
  try {
    // Truy vấn cơ sở dữ liệu để lấy ra các người dùng có vai trò là "user"
    const usersWithUserRole = await User.find({ role: "collector" });

    res.json(usersWithUserRole);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users with user role" });
  }
}

async function getUserById(req, res) {
  try {
    const { _id } = req.user;
    console.log(req.user);

    // Sử dụng aggregate để kết hợp thông tin từ hai bảng User và UserDetail
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: "userdetails", // Tên của bảng UserDetail trong cơ sở dữ liệu
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } }, // Giải nén mảng userDetail và bảo tồn phần tử null nếu không có kết quả
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem userDetail có tồn tại không và trả về kết quả phù hợp
    if (user[0].userDetail) {
      res.json(user[0]); // Trả về thông tin người dùng và userDetail nếu có
    } else {
      res.json({ ...user[0], userDetail: {} }); // Trả về thông tin người dùng và userDetail trống nếu không có
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function updateUser(req, res) {
  try {
    const { _id } = req.user;
    let updateFields = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem có thay đổi về mật khẩu hay không
    if (updateFields.password) {
      // Băm mật khẩu mới trước khi cập nhật
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    } else {
      // Nếu không có thay đổi mật khẩu, đảm bảo trường mật khẩu không bị xóa bỏ
      delete updateFields.password;
    }

    // Cập nhật thông tin người dùng
    await User.findByIdAndUpdate(_id, updateFields);

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

async function uploadImage(req, res) {
  try {
    const { _id } = req.user;

    // Kiểm tra xem người dùng đã có ảnh đại diện hay chưa bằng cách truy vấn cơ sở dữ liệu
    const existingUserDetail = await UserDetail.findOne({ userId: _id });

    // Sử dụng middleware multer để xử lý tệp tin hình ảnh
    upload.single("image")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Trả về đường dẫn của tệp tin hình ảnh đã được tải lên
      const imagePath = req.file.path;

      if (existingUserDetail) {
        // Nếu người dùng đã có ảnh đại diện, thực hiện cập nhật ảnh đại diện hiện tại
        existingUserDetail.image = imagePath;
        await existingUserDetail.save();
        res.json({
          message: "Image uploaded and user profile updated successfully",
          imagePath,
        });
      } else {
        // Nếu người dùng chưa có ảnh đại diện, thêm một bản ghi mới vào cơ sở dữ liệu
        const newUserDetail = new UserDetail({
          userId: _id,
          image: imagePath,
        });
        await newUserDetail.save();
        res.json({
          message: "Image uploaded and user profile created successfully",
          imagePath,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
}

async function createCollector(req, res) {
  try {
    const { name, email, password, address, mobile } = req.body;

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      mobile,
      role: "collector",
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to register user" });
  }
}

async function uploadCollectorAvatar(req, res) {
  try {
    const { id } = req.params;

    const userDetail = await UserDetail.findOne({ userId: id });

    // if (!blog) {
    //   return res.status(404).json({ message: "Blog not found" });
    // }

    // Sử dụng middleware multer để xử lý tệp tin hình ảnh
    upload.single("image")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Trả về đường dẫn của tệp tin hình ảnh đã được tải lên
      const imagePath = req.file.path;

      if (userDetail) {
        userDetail.image = imagePath;
        await userDetail.save();
        res.json({
          message: "Image uploaded and user profile updated successfully",
          imagePath,
        });
      } else {
        // Nếu người dùng chưa có ảnh đại diện, thêm một bản ghi mới vào cơ sở dữ liệu
        const newUserDetail = new UserDetail({
          userId: id,
          image: imagePath,
        });
        await newUserDetail.save();
        res.json({
          message: "Image uploaded and user profile created successfully",
          imagePath,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    console.log(req.user);

    // Sử dụng aggregate để kết hợp thông tin từ hai bảng User và UserDetail
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "userdetails", // Tên của bảng UserDetail trong cơ sở dữ liệu
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      { $unwind: { path: "$userDetail", preserveNullAndEmptyArrays: true } }, // Giải nén mảng userDetail và bảo tồn phần tử null nếu không có kết quả
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem userDetail có tồn tại không và trả về kết quả phù hợp
    if (user[0].userDetail) {
      res.json(user[0]); // Trả về thông tin người dùng và userDetail nếu có
    } else {
      res.json({ ...user[0], userDetail: {} }); // Trả về thông tin người dùng và userDetail trống nếu không có
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
}

async function blockUser(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block user
    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to block user" });
  }
}

async function unblockUser(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Block user
    user.isBlocked = false;
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to block user" });
  }
}

async function updateCollector(req, res) {
  try {
    const { id } = req.params;
    let updateFields = req.body;

    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra xem có thay đổi về mật khẩu hay không
    if (updateFields.password) {
      // Băm mật khẩu mới trước khi cập nhật
      updateFields.password = await bcrypt.hash(updateFields.password, 10);
    } else {
      // Nếu không có thay đổi mật khẩu, đảm bảo trường mật khẩu không bị xóa bỏ
      delete updateFields.password;
    }

    // Cập nhật thông tin người dùng
    await User.findByIdAndUpdate(id, updateFields);

    res.json({ message: "User updated successfully", existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Xóa người dùng
    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
}

module.exports = {
  register,
  login,
  getUsers,
  getUsersWithUserRole,
  getUsersWithCollectorRole,
  getUserById,
  updateUser,
  uploadImage,
  createCollector,
  uploadCollectorAvatar,
  getUser,
  blockUser,
  unblockUser,
  updateCollector,
  deleteUser,
};
