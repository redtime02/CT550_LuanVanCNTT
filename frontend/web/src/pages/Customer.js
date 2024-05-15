import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
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
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "SĐT",
    dataIndex: "mobile",
  },
  // {
  //   title: "Điểm",
  //   dataIndex: "point",
  // },
  {
    title: "Vai trò",
    dataIndex: "role",
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

const deleteCollector = async (collectorId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/auth/${collectorId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error; // Throw error for handling in UI
  }
};

const Customer = () => {
  const [data, setData] = useState([]);
  const [collectorId, setCollectorId] = useState("");
  const [open, setOpen] = useState(false);

  const showModal = (e) => {
    setOpen(true);
    setCollectorId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = async (collectorId) => {
    try {
      await deleteCollector(collectorId);
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
      const response = await axios.get(
        "http://localhost:3000/api/auth/users/role-collector"
      );
      setData(response.data);
      console.log(response.data); // Set data to the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to convert role to display string
  const getRoleDisplay = (role) => {
    if (role === "user") {
      return "Người dùng";
    } else if (role === "collector") {
      return "Người thu gom";
    } else {
      return role;
    }
  };

  // Map data to format required by Ant Design Table
  const formattedData = data.map((item, index) => ({
    key: index + 1,
    name: item?.name,
    email: item?.email,
    mobile: item?.mobile,
    // point: item?.markCount,
    role: getRoleDisplay(item?.role),
    action: (
      <>
        <Link
          className="fs-3 text-danger"
          to={`/admin/add-customer/${item?._id}`}
        >
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
      <h3 className="mb-4">Danh sách tài khoản Người thu gom</h3>
      <div>
        <Table columns={columns} dataSource={formattedData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(collectorId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn xóa tài khoản này?"
      />
    </div>
  );
};

export default Customer;
