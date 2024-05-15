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
    collectingBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    collectingLatitude: {
      type: String,
    },
    collectingLongitude: {
      type: String,
    },
    isOutdated: {
      type: Boolean,
    },
    outdatedCollector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    weightMax: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Định nghĩa virtual populate
locationSchema.virtual("details", {
  ref: "LocationDetail", // Tên của model cần tham chiếu
  localField: "_id", // Trường trong schema hiện tại để ghép thông tin
  foreignField: "locationId", // Trường trong schema của LocationDetail để so sánh
});

module.exports = mongoose.model("Location", locationSchema);
