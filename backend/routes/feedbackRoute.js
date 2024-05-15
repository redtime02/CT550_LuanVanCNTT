const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const feedbackController = require("../controllers/feedbackController");

// Ghi nhận phản hồi
router.post("/", authMiddleware, feedbackController.recordFeedback);

router.get("/", feedbackController.listFeedback);

router.get("/report", feedbackController.listReport);

router.get("/report/:id", feedbackController.getReportById);

module.exports = router;
