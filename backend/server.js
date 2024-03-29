const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const path = require('path');

const app = express();
app.use(cookieParser());

// Thiết lập kết nối đến cơ sở dữ liệu MongoDB
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/trash-type", require("./routes/trashTypeRoute"));
app.use("/api/location", require("./routes/locationRoute"));
app.use("/api/feedback", require("./routes/feedbackRoute"));
app.use("/api/bonus", require("./routes/bonusItemRoute"));
app.use("/api/reward", require("./routes/rewardedRoute"));

// Đường dẫn đến thư mục chứa hình ảnh
const uploadsDir = 'E:/CT550_LuanVanCNTT/backend/uploads/';

// Endpoint GET để hiển thị hình ảnh
app.get('/api/image/*', (req, res) => {
  const imagePath = req.params[0];
  const fullPath = path.join(uploadsDir, imagePath);
  
  // Phản hồi với nội dung của tệp hình ảnh
  res.sendFile(fullPath);
});


// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
