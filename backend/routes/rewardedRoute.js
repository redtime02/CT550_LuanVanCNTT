const express = require("express");
const router = express.Router();
const {
  chooseReward,
  getRewards,
} = require("../controllers/rewardedController");

router.post("/", chooseReward);

router.get("/", getRewards);

module.exports = router;
