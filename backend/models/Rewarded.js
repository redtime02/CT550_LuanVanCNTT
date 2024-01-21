const mongoose = require("mongoose");

const rewardedSchema = new mongoose.Schema({
  bonusDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//Export the model
module.exports = mongoose.model("Rewarded", rewardedSchema);
