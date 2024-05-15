import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import CustomInput from "../components/CustomInput";

const AddBrand = () => {
  const [description, setDescription] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [name, setName] = useState("");
  const [point, setPoint] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const getItemId = location.pathname.split("/")[3];
  console.log(getItemId);

  useEffect(() => {
    if (getItemId !== undefined) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/bonus/${getItemId}`
      );

      const imageName = response.data.bonusItem.image.split("\\")[1];
      console.log(imageName);

      // Lấy đường dẫn hình ảnh từ response
      const imagePath = `http://localhost:3000/api/image/${imageName}`;

      // Tạo một request mới để tải hình ảnh dưới dạng blob
      const imageBlobResponse = await fetch(imagePath);
      const imageBlob = await imageBlobResponse.blob();

      // Đặt dữ liệu vào state, dùng imageBlob thay vì imageBlobResponse.data
      setName(response.data.bonusItem.name);
      setDescription(response.data.bonusItem.description);
      setPoint(response.data.bonusItem.point);
      setUploadedImage(imageBlob);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDescription = (e) => {
    setDescription(e);
    console.log(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Kiểm tra xem có hình ảnh được tải lên không
      if (uploadedImage) {
        // let uploadedImage = uploadedImage;
        // // Nếu hình ảnh không phải là định dạng jpg, chuyển đổi thành jpg
        // if (uploadedImage.type !== "image/jpeg") {
        //   const convertedImage = await convertToJpg(uploadedImage);
        //   uploadedImage = convertedImage;
        // }

        if (getItemId !== undefined) {
          const response = await axios.put(
            `http://localhost:3000/api/bonus/${getItemId}`,
            {
              name,
              description: description,
              point,
            }
          );

          const bonusId = response.data.bonusItem._id;
          const imageFile = await blobToFile(
            uploadedImage,
            "uploadedImage.jpg"
          );
          // Gửi hình ảnh đến API
          const formData = new FormData();
          formData.append("image", imageFile);

          await axios.post(
            `http://localhost:3000/api/bonus/${bonusId}/image`,
            formData
          );
          console.log(imageFile);

          // Clear form fields
          setName("");
          setDescription("");
          setPoint("");
          setUploadedImage(null);

          // Handle success scenario
          console.log("Bonus updated successfully!");

          navigate("/admin/brand-list");
        } else {
          // Gửi dữ liệu tạo phần thưởng đến API
          const response = await axios.post("http://localhost:3000/api/bonus", {
            name,
            description: description,
            point,
          });

          const bonusId = response.data.bonusItem._id;

          // Gửi hình ảnh đến API
          const formData = new FormData();
          formData.append("image", uploadedImage);

          await axios.post(
            `http://localhost:3000/api/bonus/${bonusId}/image`,
            formData
          );

          // Clear form fields
          setName("");
          setDescription("");
          setPoint("");
          setUploadedImage(null);

          // Handle success scenario
          console.log("Bonus added successfully!");

          navigate("/admin/brand-list");
        }
      } else {
        console.log("No image uploaded");
      }
    } catch (error) {
      // Handle error scenario
      console.error("Error:", error);
    }
  };

  const blobToFile = (blob, fileName) => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  // Function to convert any image to jpg format
  const convertToJpg = async (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              const convertedImage = new File([blob], "uploadedImage.jpg", {
                type: "image/jpeg",
              });
              resolve(convertedImage);
            },
            "image/jpeg",
            1
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getItemId !== undefined ? "Cập nhật" : "Thêm"} phần thưởng
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
            val={name}
            label="Nhập tên phần thưởng"
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <ReactQuill
            theme="snow"
            value={description}
            onChange={(evt) => handleDescription(evt)}
          />
          <CustomInput
            type="number"
            val={point}
            label="Nhập điểm thưởng"
            onChange={(e) => setPoint(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-success border-0 rounded-3 my-5"
          >
            {getItemId !== undefined ? "Lưu" : "Thêm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;
