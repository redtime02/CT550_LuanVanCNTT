const multer = require("multer");

// Cấu hình multer để lưu trữ hình ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Thay đổi đường dẫn tới thư mục lưu trữ hình ảnh của bạn
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Định dạng tên tệp tin hình ảnh (có thể tuỳ chỉnh theo ý muốn)
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Kiểm tra và chỉ chấp nhận các tệp tin ảnh
const fileFilter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
  }
};

// Tạo middleware multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
