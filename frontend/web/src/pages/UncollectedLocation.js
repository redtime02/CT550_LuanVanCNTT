import React, { useState } from "react";
import { Table, Input } from "antd";
import { useEffect } from "react";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const { Search } = Input;

const columns = [
  {
    title: "STT",
    dataIndex: "key",
  },
  {
    title: "Địa điểm",
    dataIndex: "location",
  },
  {
    title: "Ngày đánh dấu",
    dataIndex: "date",
  },
  {
    title: "Hành động",
    dataIndex: "action",
  },
];

const deleteLocation = async (locationId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/location/${locationId}`
    );
    console.log(response.data); // Log success message
    return response.data;
    // alert(trashTypeId);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error; // Throw error for handling in UI
  }
};

const UncollectedLocation = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [locationId, setLocationId] = useState("");
  const [open, setOpen] = useState(false);

  const showModal = (e) => {
    setOpen(true);
    setLocationId(e);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const handleDelete = async (locationId) => {
    try {
      await deleteLocation(locationId);
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
        "http://localhost:3000/api/location/un-location"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Map data to format required by Ant Design Table
  const formattedData = data.map((item, index) => ({
    key: index + 1,
    location: item?.name,
    date: moment(item?.createdAt).format("DD/MM/YYYY hh:mm:ss"),
    action: (
      <>
        <Link
          className="ms-3 fs-3 text-danger"
          to={`/admin/un-location/${item?._id}`}
        >
          <AiOutlineEye />
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

  // Filter data based on search text
  const filteredData = formattedData.filter((item) =>
    item.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="mt-4">
      <h3 className="mb-4">Danh sách địa điểm chưa thu nhặt</h3>
      <Search
        placeholder="Tìm kiếm địa điểm"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200, float: "right", marginBottom: 10 }}
      />
      <div>
        <Table columns={columns} dataSource={filteredData} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(locationId);
          hideModal();
        }}
        title="Bạn có chắc chắn rằng bạn muốn xóa địa điểm này?"
      />
    </div>
  );
};

export default UncollectedLocation;
