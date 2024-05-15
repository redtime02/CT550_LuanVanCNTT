const express = require("express");
const router = express.Router();
const {
  chooseReward,
  getRewards,
  getRewardsByUsername,
} = require("../controllers/rewardedController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, chooseReward);

router.get("/", getRewards);

router.get("/user", authMiddleware, getRewardsByUsername);

module.exports = router;
