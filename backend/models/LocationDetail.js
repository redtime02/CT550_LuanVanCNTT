const mongoose = require("mongoose");

const locationDetailSchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  trashTypeId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrashType",
      required: true,
    },
  ],
  weight: {
    type: Number,
  },
  otherDetails: {
    type: String,
  },
});

const LocationDetail = mongoose.model("LocationDetail", locationDetailSchema);

module.exports = LocationDetail;
