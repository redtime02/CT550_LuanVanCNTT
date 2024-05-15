import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";
import moment from "moment";

const ViewEnquiry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportId = location.pathname.split("/")[3];

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/feedback/report/${reportId}`
        );
        setReport(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReport();
  }, [reportId]);

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">Chi tiết phản hồi</h3>
        <button
          className="bg-transpatent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Trở về
        </button>
      </div>
      <div className="mt-5 bg-white d-flex gap-3 p-4 rounded-3 flex-column">
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Họ tên:</h5>
          <p className="mb-0 fs-6">{report?.userId.name}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Email:</h5>
          <p className="mb-0 fs-6">
            <a href={`mailto:${report?.userId.email}`}>
              {report?.userId.email}
            </a>
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">SĐT:</h5>
          <p className="mb-0 fs-6">
            <a href={`tel:+84${report?.userId.mobile}`}>
              {report?.userId.mobile}
            </a>
          </p>
        </div>
        {/* <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Địa điểm báo cáo:</h5>
          <p className="mb-0 fs-6">{report?.locationName}</p>
        </div> */}
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Ngày gửi:</h5>
          <p className="mb-0 fs-6">
            {moment(report?.createdAt).format("DD/MM/YYYY hh:mm:ss")}
          </p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h5 className="mb-0">Nội dung phản hồi:</h5>
          <p className="mb-0 fs-6">{report?.message}</p>
        </div>
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

export default ViewEnquiry;
