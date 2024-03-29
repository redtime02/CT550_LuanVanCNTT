const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    require: true,
  },
  mobile: {
    type: String,
    require: true,
  },
  point: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: 'user',
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
