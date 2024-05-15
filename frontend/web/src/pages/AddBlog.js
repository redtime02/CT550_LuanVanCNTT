import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import CustomInput from "../components/CustomInput";

const AddBlog = () => {
  const [content, setContent] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [title, setTitle] = useState("");
  // const [point, setPoint] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  console.log(getBlogId);

  useEffect(() => {
    if (getBlogId !== undefined) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/blog/${getBlogId}`
      );

      const imageName = response.data.blog.image.split("\\")[1];
      console.log(imageName);

      // Lấy đường dẫn hình ảnh từ response
      const imagePath = `http://localhost:3000/api/image/${imageName}`;

      // Tạo một request mới để tải hình ảnh dưới dạng blob
      const imageBlobResponse = await fetch(imagePath);
      const imageBlob = await imageBlobResponse.blob();

      // Đặt dữ liệu vào state, dùng imageBlob thay vì imageBlobResponse.data
      setTitle(response.data.blog.title);
      setContent(response.data.blog.content);
      setUploadedImage(imageBlob);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleContent = (e) => {
    setContent(e);
    console.log(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (getBlogId !== undefined) {
        // Step 1: Gửi dữ liệu tạo phần thưởng đến API
        const response = await axios.put(
          `http://localhost:3000/api/blog/${getBlogId}`,
          {
            title,
            content: content,
          }
        );

        // Step 2: Lấy id của phần thưởng vừa tạo
        const blogId = response.data.blog._id;
        console.log(response.data.blog);
        console.log(blogId);

        // Step 3: Nếu có hình ảnh được tải lên, gửi hình ảnh đến API
        if (uploadedImage) {
          const imageFile = await blobToFile(
            uploadedImage,
            "uploadedImage.jpg"
          );
          const formData = new FormData();
          formData.append("image", imageFile);

          await axios.post(
            `http://localhost:3000/api/blog/${blogId}`,
            formData
          );
        }

        // Clear form fields
        setTitle("");
        setContent("");
        setUploadedImage(null);

        // Handle success scenario
        console.log("Blog updated successfully!");
        alert("Cập nhật thông báo thành công!");

        navigate("/admin/blog-list");
      } else {
        // Step 1: Gửi dữ liệu tạo phần thưởng đến API
        const response = await axios.post("http://localhost:3000/api/blog", {
          title,
          content: content,
        });

        // Step 2: Lấy id của phần thưởng vừa tạo
        const blogId = response.data.blog._id;
        console.log(response.data.blog);
        console.log(blogId);

        // Step 3: Nếu có hình ảnh được tải lên, gửi hình ảnh đến API
        if (uploadedImage) {
          const formData = new FormData();
          formData.append("image", uploadedImage);

          await axios.post(
            `http://localhost:3000/api/blog/${blogId}`,
            formData
          );
        }

        // Clear form fields
        setTitle("");
        setContent("");
        setUploadedImage(null);

        // Handle success scenario
        console.log("Blog added successfully!");
        alert("Thêm thông báo thành công!");

        navigate("/admin/blog-list");
      }
    } catch (error) {
      // Handle error scenario
      console.error("Error adding bonus:", error);
      alert("Đã có lỗi xảy ra!");
    }
  };

  const blobToFile = (blob, fileName) => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getBlogId !== undefined ? "Cập nhật" : "Thêm"} thông báo
      </h3>
      <div className="">
        <form action="" onSubmit={handleSubmit}>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => setUploadedImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Thêm hình</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="show-images d-flex flex-wrap gap-3">
            {/* {imgState?.map((i, j) => {
              return ( */}
            <div className="position-relative">
              {uploadedImage && (
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => setUploadedImage(null)}
                  ></button>
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </div>
            {/* );
            })} */}
          </div>
          <CustomInput
            type="text"
            val={title}
            label="Nhập tiêu đề thông báo"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(evt) => handleContent(evt)}
          />
          {/* <CustomInput
            type="number"
            val={point}
            label="Nhập điểm thưởng"
            onChange={(e) => setPoint(e.target.value)}
          /> */}
          <button
            type="submit"
            className="btn btn-success border-0 rounded-3 my-5"
          >
            {getBlogId !== undefined ? "Lưu" : "Thêm"}
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AddBlog;
