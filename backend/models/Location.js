const mongoose = require("mongoose");

var locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    imageUrl: {
      type: String,
      default: null,
    },
    isCollected: {
      type: Boolean,
      default: false,
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
