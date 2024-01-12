const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Ghi nhận phản hồi
router.post("/", feedbackController.recordFeedback);

module.exports = router;
