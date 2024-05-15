import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";

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
  {
    title: "Điểm thu nhặt",
    dataIndex: "collectCount",
  },
  // {
  //   title: "Vai trò",
  //   dataIndex: "role",
  // },
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

const CouponList = () => {
  const [data, setData] = useState([]);

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
    collectCount: item?.collectCount,
    role: getRoleDisplay(item?.role), // Use getRoleDisplay function to convert role
  }));

  const sortedData = formattedData
    .slice()
    .sort((a, b) => b.collectCount - a.collectCount);

  return (
    <div className="mt-4">
      <h3 className="mb-4">Xếp hạng người thu gom</h3>
      <div>
        <Table columns={columns} dataSource={sortedData} />
      </div>
    </div>
  );
};

export default CouponList;
