import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaBan } from "react-icons/fa6";
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

const blockUser = async (userId) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/auth/block/${userId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Throw error for handling in UI
  }
};

const unblockUser = async (userId) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/auth/un-block/${userId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Throw error for handling in UI
  }
};

const User = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [unopen, setUnOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setUserId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const showUnModal = (e) => {
    setUnOpen(true);
    setUserId(e);
  };

  const hideUnModal = () => {
    setUnOpen(false);
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const handleBlock = async (userId) => {
    try {
      await blockUser(userId);
      // Refresh data after deletion if needed
      fetchData();
    } catch (error) {
      // Handle error
      console.error("Error deleting trash type:", error);
    }
  };

  const handleUnBlock = async (userId) => {
    try {
      await unblockUser(userId);
      // Refresh data after deletion if needed
      fetchData();
    } catch (error) {
      // Handle error
      console.error("Error deleting trash type:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/users/role-user"
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
        {/* <Link
          className="fs-3 text-danger"
          to={`/admin/add-customer/${item?._id}`}
        >
          <BiEdit />
        </Link> */}
        {item?.isBlocked ? (
          <span className="text-danger text-center">
            Tài khoản đã bị chặn.{" "}
            <a
              className="text-info text-decoration-none"
              onClick={() => showUnModal(item?._id)}
            >
              Gỡ chặn
            </a>
          </span>
        ) : (
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(item?._id)}
          >
            <FaBan />
          </button>
        )}
      </>
    ),
  }));

  return (
    <div className="mt-4">
      <h3 className="mb-4">Danh sách tài khoản Người dùng</h3>
      <div>
        <Table columns={columns} dataSource={formattedData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleBlock(userId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn chặn tài khoản này?"
      />
      <CustomModal
        hideModal={hideUnModal}
        open={unopen}
        performAction={() => {
          handleUnBlock(userId);
          hideUnModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn bỏ chặn tài khoản này?"
      />
    </div>
  );
};

export default User;
