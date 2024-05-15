const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
  },
  walletAmount: {
    type: Number,
    default: 0,
  },
});

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

module.exports = UserDetail;
