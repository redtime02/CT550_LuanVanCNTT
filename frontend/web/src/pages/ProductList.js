import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
// import { AiFillDelete } from "react-icons/ai";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên",
    dataIndex: "name",
  },
  {
    title: "Điểm ve chai",
    dataIndex: "point",
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];
// const data1 = [];
// for (let i = 0; i < 46; i++) {
//   data1.push({
//     key: i,
//     name: `Edward King ${i}`,
//     email: `London, Park Lane no. ${i}`,
//     mobile: 1,
//     point: 0,
//     role: `London, Park Lane no. ${i}`,
//   });
// }

const deleteTrashType = async (trashTypeId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/trash-type/${trashTypeId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting trash type:", error);
    throw error; // Throw error for handling in UI
  }
};

const ProductList = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [trashTypeId, setTrashTypeId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setTrashTypeId(e);
    // setProductId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = async (trashTypeId) => {
    try {
      await deleteTrashType(trashTypeId);
      // Refresh data after deletion if needed
      fetchData();
    } catch (error) {
      // Handle error
      console.error("Error deleting trash type:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/trash-type");
      setData(response.data);
      console.log(response.data); // Set data to the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Map data to format required by Ant Design Table
  const formattedData = data.map((item, index) => ({
    key: index + 1,
    name: item?.name,
    point: item?.point,
    action: (
      <>
        <Link className="fs-3 text-danger" to={`/admin/product/${item?._id}`}>
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(item?._id)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  return (
    <div className="mt-4">
      <h3 className="mb-4">Danh sách ve chai</h3>
      <div>
        <Table columns={columns} dataSource={formattedData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(trashTypeId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn xóa ve chai này?"
      />
    </div>
  );
};

export default ProductList;
