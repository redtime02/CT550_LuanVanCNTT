import React, { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import Moment from "react-moment";
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
    dataIndex: "title",
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    render: (createdAt) => (
      <Moment format="DD/MM/YYYY HH:mm:ss">{createdAt}</Moment> // Render createdAt using Moment component with desired format
    ),
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
//     title: `Edward King ${i}`,
//     email: `London, Park Lane no. ${i}`,
//     mobile: 1,
//     point: 0,
//     role: `London, Park Lane no. ${i}`,
//   });
// }

const deleteBlog = async (blogId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/blog/${blogId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error; // Throw error for handling in UI
  }
};

const BlogList = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [blogId, setBlogId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setBlogId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = async (blogId) => {
    try {
      await deleteBlog(blogId);
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
      const response = await axios.get("http://localhost:3000/api/blog");
      const formattedData = response.data.blogs.map((item, index) => ({
        key: index + 1, // Sử dụng một trường duy nhất làm key, ví dụ như _id
        title: item.title,
        createdAt: item.createdAt,
        action: (
          <>
            <Link className="fs-3 text-danger" to={`/admin/blog/${item?._id}`}>
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
      setData(formattedData);
      console.log(formattedData); // Log formatted data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // // Map data to format required by Ant Design Table
  // const formattedData = data.map((item, index) => ({
  //   key: index,
  //   name: item?.name,
  //   point: item?.point,
  // }));

  return (
    <div className="mt-4">
      <h3 className="mb-4">Danh sách thông báo</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(blogId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn xóa thông báo này?"
      />
    </div>
  );
};

export default BlogList;
