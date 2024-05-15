const Feedback = require("../models/Feedback");

// Ghi nhận phản hồi từ người dùng
async function recordFeedback(req, res) {
  try {
    const { _id } = req.user;
    const { message, locationName } = req.body;

    const feedback = new Feedback({
      userId: _id,
      message: message,
      locationName: locationName,
    });

    await feedback.save();

    res.json({ message: "Feedback recorded" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record feedback" });
  }
}

// Hiển thị danh sách phản hồi
async function listFeedback(req, res) {
  try {
    // Lấy tất cả các phản hồi từ cơ sở dữ liệu
    const feedbackList = await Feedback.find({ locationName: null }).populate(
      "userId"
    );

    res.json(feedbackList); // Trả về danh sách phản hồi cho client
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback list" });
  }
}

// Hiển thị danh sách báo cáo
async function listReport(req, res) {
  try {
    // Lấy tất cả các phản hồi từ cơ sở dữ liệu
    const feedbackList = await Feedback.find({
      locationName: { $ne: null },
    }).populate("userId");

    res.json(feedbackList); // Trả về danh sách phản hồi cho client
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback list" });
  }
}

// Hiển thị báo cáo theo ID
async function getReportById(req, res) {
  try {
    const { id } = req.params;

    // Tìm báo cáo theo ID
    const report = await Feedback.findById(id).populate("userId");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report); // Trả về báo cáo cho client
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
}

module.exports = {
  recordFeedback,
  listFeedback,
  listReport,
  getReportById,
};
