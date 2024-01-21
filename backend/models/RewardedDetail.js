const mongoose = require("mongoose");

const rewardedDetailSchema = new mongoose.Schema({
  rewardedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rewarded",
    required: true,
  },
  bonusItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BonusItem",
    required: true,
  },
});

// Export the model
module.exports = mongoose.model("RewardedDetail", rewardedDetailSchema);
