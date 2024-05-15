const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// Định nghĩa route POST để tạo mới một blog
router.post("/", blogController.createBlog);

router.post("/:id", blogController.uploadImage);

router.get("/", blogController.getBlogs);

router.get("/:id", blogController.getBlogById);

router.put("/:id", blogController.updateBlog);

router.delete("/:id", blogController.deleteBlog);

module.exports = router;
