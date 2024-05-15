import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [point, setPoint] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const getTrashId = location.pathname.split("/")[3];
  console.log(getTrashId);

  useEffect(() => {
    if (getTrashId !== undefined) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/trash-type/waste/${getTrashId}`
      );
      // setData(response.data);
      console.log(response.data);
      setName(response.data.name);
      setPoint(response.data.point);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleName = (e) => {
    console.log(e);
  };

  const handlePoint = (e) => {
    console.log(e);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (getTrashId !== undefined) {
        const response = await axios.put(
          `http://localhost:3000/api/trash-type/${getTrashId}`,
          {
            name: name,
            point: point,
          }
        );
        console.log(response.data);
        navigate("/admin/product-list");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/trash-type",
          {
            name: name,
            point: point,
          }
        );
        console.log(response.data);
        // Log the response if needed
        // Add any further logic after successful POST request
        navigate("/admin/product-list");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      // Handle error as needed
    }
  };

  return (
    <div>
      <h3 className="mb-4 title">
        {getTrashId !== undefined ? "Cập nhật" : "Thêm"} ve chai
      </h3>
      <div className="">
        <form action="" onSubmit={handleSubmit}>
          <CustomInput
            type="text"
            label="Nhập tên ve chai"
            name="name"
            val={name}
            onChange={(evt) => {
              setName(evt.target.value);
              handleName(evt.target.value);
            }}
          />
          <CustomInput
            type="number"
            label="Nhập điểm ve chai"
            val={point}
            name="point"
            onChange={(evt) => {
              setPoint(evt.target.value);
              handlePoint(evt.target.value);
            }}
          />
          <button
            type="submit"
            className="btn btn-success border-0 rounded-3 my-5"
          >
            {getTrashId !== undefined ? "Lưu" : "Thêm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
