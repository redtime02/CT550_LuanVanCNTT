const Blog = require("../models/Blog");
const BlogDetail = require("../models/BlogDetail");
const upload = require("../middlewares/multerMiddleware");

async function createBlog(req, res) {
  try {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
    });
    await blog.save();

    const blogDetail = new BlogDetail({
      content,
      blog: blog._id,
    });
    await blogDetail.save();

    res.json({ message: "Blog added successfully", blog, blogDetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add blog" });
  }
}

async function uploadImage(req, res) {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Sử dụng middleware multer để xử lý tệp tin hình ảnh
    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Trả về đường dẫn của tệp tin hình ảnh đã được tải lên
      const imagePath = req.file.path;

      // Cập nhật đường dẫn hình ảnh cho vật thưởng
      blog.image = imagePath;
      blog.save();

      res.json({
        message: "Image uploaded and blog updated successfully",
        imagePath,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to upload image" });
  }
}

async function getBlogs(req, res) {
  try {
    // Lấy tất cả các blog từ cơ sở dữ liệu
    const blogs = await Blog.find();

    // Kiểm tra nếu không có blog nào được tìm thấy
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found" });
    }

    // Lặp qua mỗi blog và lấy chi tiết của từng blog
    const blogDetails = await Promise.all(
      blogs.map(async (blog) => {
        const blogDetail = await BlogDetail.findOne({ blog: blog._id });
        return {
          _id: blog._id,
          title: blog.title,
          content: blogDetail ? blogDetail.content : "",
          image: blog.image || "",
          createdAt: blog.createdAt,
        };
      })
    );

    res.json({ blogs: blogDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get blogs" });
  }
}

async function getBlogById(req, res) {
  try {
    const { id } = req.params;

    // Tìm blog dựa trên id
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Tìm chi tiết của blog dựa trên id của blog
    const blogDetail = await BlogDetail.findOne({ blog: id });

    // Tạo đối tượng blog response từ blog và blogDetail
    const blogResponse = {
      _id: blog._id,
      title: blog.title,
      content: blogDetail ? blogDetail.content : "",
      image: blog.image || "",
      createdAt: blog.createdAt,
    };

    // Trả về đối tượng blog đã tìm thấy
    res.json({ blog: blogResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get blog" });
  }
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Tìm blog dựa trên id
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cập nhật tiêu đề của blog
    blog.title = title;
    await blog.save();

    // Tìm hoặc tạo chi tiết của blog
    let blogDetail = await BlogDetail.findOne({ blog: id });
    if (!blogDetail) {
      blogDetail = new BlogDetail({
        content,
        blog: id,
      });
    } else {
      blogDetail.content = content;
    }
    await blogDetail.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update blog" });
  }
}

async function deleteBlog(req, res) {
  try {
    const { id } = req.params;

    // Tìm blog dựa trên id
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Xóa blog
    await Blog.findByIdAndDelete(id);

    // Xóa chi tiết của blog
    await BlogDetail.findOneAndDelete({ blog: id });

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
}

module.exports = {
  createBlog,
  uploadImage,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
