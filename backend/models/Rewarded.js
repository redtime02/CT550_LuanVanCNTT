const mongoose = require("mongoose");

var rewardedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
