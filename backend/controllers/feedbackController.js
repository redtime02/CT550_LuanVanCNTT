const Feedback = require("../models/Feedback");

// Ghi nhận phản hồi từ người dùng
async function recordFeedback(req, res) {
  try {
    const { userId, message } = req.body;

    const feedback = new Feedback({
      userId: userId,
      message: message,
    });

    await feedback.save();

    res.json({ message: "Feedback recorded" });
  } catch (error) {
    res.status(500).json({ message: "Failed to record feedback" });
  }
}

module.exports = {
  recordFeedback,
};
