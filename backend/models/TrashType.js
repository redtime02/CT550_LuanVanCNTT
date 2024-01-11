const mongoose = require("mongoose");

const trashTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const TrashType = mongoose.model("TrashType", trashTypeSchema);

module.exports = TrashType;
