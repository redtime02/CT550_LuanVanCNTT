import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Tên người gửi",
    dataIndex: "name",
  },
  {
    title: "Ngày tạo",
    dataIndex: "date",
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

const ProductList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/feedback");
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setData(sortedData); // Set data to the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Map data to format required by Ant Design Table
  const formattedData = data.map((item, index) => ({
    key: index + 1,
    name: item?.userId?.name,
    date: moment(item?.createdAt).format("DD/MM/YYYY"),
    action: (
      <>
        <Link
          className="ms-3 fs-3 text-danger"
          to={`/admin/enquiries/${item?._id}`}
        >
          <AiOutlineEye />
        </Link>
        {/* <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(enqState[i]._id)}
        >
          <AiFillDelete />
        </button> */}
      </>
    ),
  }));

  return (
    <div className="mt-4">
      <h3 className="mb-4">Danh sách phản hồi</h3>
      <div>
        <Table columns={columns} dataSource={formattedData} />
      </div>
    </div>
  );
};

export default ProductList;
