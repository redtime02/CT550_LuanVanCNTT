import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import moment from "moment";

const ViewLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationId = location.pathname.split("/")[3];

  const [locat, setLocat] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/location/mark/${locationId}`
        );
        setLocat(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
  }, [locationId]);

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">Chi tiết địa điểm</h3>
        <button
          className="bg-transpatent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Trở về
        </button>
      </div>
      <div className="d-flex align-items-center gap-3">
        {/* <h5 className="mb-0"></h5> */}
        <img
          src={`http://localhost:3000/api/image/${locat?.images[0].replace(
            "uploads\\",
            ""
          )}`}
          alt="Địa điểm"
          className="img-fluid w-25 centered-image"
        />
      </div>
      <div className="mt-5 bg-white d-flex gap-3 p-4 rounded-3 flex-column">
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Họ tên người đăng:</h5>
          <p className="mb-0 fs-6">{locat?.markedBy.name}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Email:</h5>
          <p className="mb-0 fs-6">
            <a href={`mailto:${locat?.markedBy.email}`}>
              {locat?.markedBy.email}
            </a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">SĐT:</h5>
          <p className="mb-0 fs-6">
            <a href={`tel:+84${locat?.markedBy.mobile}`}>
              {locat?.markedBy.mobile}
            </a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Địa điểm đánh dấu:</h5>
          <p className="mb-0 fs-6">{locat?.name}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Ngày đánh dấu:</h5>
          <p className="mb-0 fs-6">
            {moment(locat?.createdAt).format("DD/MM/YYYY hh:mm:ss")}
          </p>
        </div>
        {/* <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Nội dung báo cáo:</h5>
          <p className="mb-0 fs-6">{locat?.message}</p>
        </div> */}
        {/* <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Đặt trạng thái:</h5>
          <div>
            <select
              name=""
              defaultValue={enqStatus ? enqStatus : "Submitted"}
              className="form-control form-select"
              id=""
              onChange={(e) => setEnquiryStatus(e.target.value, getEnqId)}
            >
              <option value="Submitted">Submitted</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ViewLocation;
