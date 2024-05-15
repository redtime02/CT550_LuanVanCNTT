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
    title: "Điểm đổi thưởng",
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

const deleteItem = async (bonusItemId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/bonus/${bonusItemId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error; // Throw error for handling in UI
  }
};

const BrandList = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [bonusItemId, setBonusItemId] = useState("");

  const showModal = (e) => {
    setOpen(true);
    setBonusItemId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = async (bonusItemId) => {
    try {
      await deleteItem(bonusItemId);
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
      const response = await axios.get("http://localhost:3000/api/bonus");
      const formattedData = response.data.bonusItems.map((item, index) => ({
        key: index + 1, // Sử dụng một trường duy nhất làm key, ví dụ như _id
        name: item.name,
        point: item.point,
        action: (
          <>
            <Link className="fs-3 text-danger" to={`/admin/brand/${item?._id}`}>
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
      <h3 className="mb-4">Danh sách phần thưởng</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(bonusItemId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn xóa ve chai này?"
      />
    </div>
  );
};

export default BrandList;
