const mongoose = require("mongoose");

const BlogDetailSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
});

module.exports = mongoose.model("BlogDetail", BlogDetailSchema);
