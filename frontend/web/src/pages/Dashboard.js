import React, { useEffect, useState } from "react";
import { BsArrowDownLeft, BsArrowDownRight } from "react-icons/bs";
import { Column } from "@ant-design/plots";
import { Table } from "antd";
import axios from "axios";

const columns = [
  {
    title: "Mã đơn",
    dataIndex: "key",
  },
  {
    title: "Tên",
    dataIndex: "name",
  },
  {
    title: "Số lượng sản phẩm",
    dataIndex: "product",
  },
  {
    title: "Tổng tiền",
    dataIndex: "price",
  },
  {
    title: "Tổng tiền sau khi giảm giá",
    dataIndex: "dprice",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
];
const data1 = [];
for (let i = 0; i < 46; i++) {
  data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: `London, Park Lane no. ${i}`,
    price: 1,
    drpice: 0,
    status: `London, Park Lane no. ${i}`,
  });
}

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalCollectedWeight, setTotalCollectedWeight] = useState(null);
  const [totalCollectedLocations, setTotalCollectedLocations] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/location/monthly")
      .then((response) => {
        setMonthlyData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monthly data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/location/total") // Gọi route mới
      .then((response) => {
        setTotalCollectedWeight(response.data.totalWeight); // Lưu trữ dữ liệu tổng trọng lượng
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total collected weight:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/location/count") // Gọi route mới
      .then((response) => {
        setTotalCollectedLocations(response.data.totalCollectedLocations); // Lưu trữ dữ liệu tổng trọng lượng
        console.log(response.data.totalCollectedLocations);
      })
      .catch((error) => {
        console.error("Error fetching total collected locations:", error);
      });
  }, []);

  // const data = [
  //   {
  //     type: "1",
  //     sales: 38,
  //   },
  //   {
  //     type: "2",
  //     sales: 52,
  //   },
  //   {
  //     type: "3",
  //     sales: 61,
  //   },
  //   {
  //     type: "4",
  //     sales: 145,
  //   },
  //   {
  //     type: "5",
  //     sales: 48,
  //   },
  //   {
  //     type: "6",
  //     sales: 38,
  //   },
  //   {
  //     type: "7",
  //     sales: 38,
  //   },
  //   {
  //     type: "8",
  //     sales: 38,
  //   },
  //   {
  //     type: "9",
  //     sales: 38,
  //   },
  //   {
  //     type: "10",
  //     sales: 38,
  //   },
  //   {
  //     type: "11",
  //     sales: 38,
  //   },
  //   {
  //     type: "12",
  //     sales: 38,
  //   },
  // ];
  const config = {
    data: monthlyData,
    xField: "_id",
    yField: "totalWeight",
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      _id: {
        alias: "Tháng",
      },
      totalWeight: {
        alias: "Tổng số kg thu nhặt được",
      },
    },
  };
  return (
    <div>
      <h3 className="mb-4 title">Bảng điều khiển</h3>
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="">Tổng số kg đã thu nhặt</p>
            <h4 className="mb-0 sub-title">
              {/* {yearlyDataState && yearlyDataState[0]?.amount} VND */}
              {totalCollectedWeight} kg
            </h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <p className="mb-0 desc">Trong năm</p>
          </div>
        </div>
        <div className="d-flex p-3 justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className="">Tổng số địa điểm đã thu nhặt</p>
            <h4 className="mb-0 sub-title">
              {/* {yearlyDataState && yearlyDataState[0]?.count} */}
              {totalCollectedLocations}
            </h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <p className="mb-0 desc">Trong năm</p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between" gap-3>
        <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-4 title">Thống kê thu nhặt từng tháng</h3>
          <div>
            <Column {...config} />
          </div>
        </div>
        {/* <div className="mt-4 flex-grow-1 w-50">
          <h3 className="mb-4 title">Thống kê số hàng bán được</h3>
          <div>
            <Column {...config2} />
          </div>
        </div> */}
      </div>
      {/* <div className="mt-4">
        <h3 className="mb-4">Các đơn hàng gần đây</h3>
        <div>
          <Table columns={columns} dataSource={data1} />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
