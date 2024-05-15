import React, { useState } from "react";
import { Table } from "antd";
// import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import {
//   deleteAEnquiry,
//   getCategoryList,
//   resetState,
//   updateAEnquiry,
// } from "../features/enquiry/enquirySlice";
// import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
// import CustomModal from "../components/CustomModal";

// const columns = [
//   {
//     title: "Mã đơn",
//     dataIndex: "key",
//   },
//   {
//     title: "Tên",
//     dataIndex: "name",
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//   },
//   {
//     title: "SĐT",
//     dataIndex: "mobile",
//   },
//   {
//     title: "Bình luận",
//     dataIndex: "comment",
//   },
//   {
//     title: "Trạng thái",
//     dataIndex: "status",
//   },
//   {
//     title: "Hành động",
//     dataIndex: "action",
//   },
// ];

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

const CategoryList = () => {
  //   const dispatch = useDispatch();
  //   const [open, setOpen] = useState(false);
  //   const [enqId, setEnqId] = useState("");
  //   const showModal = (e) => {
  //     setOpen(true);
  //     setEnqId(e);
  //   };

  //   const hideModal = () => {
  //     setOpen(false);
  //   };
  //   useEffect(() => {
  //     dispatch(resetState());
  //     dispatch(getEnquiries());
  //   }, []);
  //   const enqState = useSelector((state) => state.enquiry.enquiries);

  //   const data1 = [];
  //   for (let i = 0; i < enqState?.length; i++) {
  //     data1.push({
  //       key: i + 1,
  //       name: enqState[i].name,
  //       email: enqState[i].email,
  //       mobile: enqState[i].mobile,
  //       comment: enqState[i].comment,
  //       status: (
  //         <>
  //           <select
  //             name=""
  //             defaultValue={enqState[i].status ? enqState[i].status : "Submitted"}
  //             className="form-control form-select"
  //             id=""
  //             onChange={(e) => setEnquiryStatus(e.target.value, enqState[i]._id)}
  //           >
  //             <option value="Submitted">Submitted</option>
  //             <option value="Contacted">Contacted</option>
  //             <option value="In Progress">In Progress</option>
  //             <option value="Resolved">Resolved</option>
  //           </select>
  //         </>
  //       ),
  //       action: (
  //         <>
  //           <Link
  //             className="ms-3 fs-3 text-danger"
  //             to={`/admin/enquiries/${enqState[i]._id}`}
  //           >
  //             <AiOutlineEye />
  //           </Link>
  //           <button
  //             className="ms-3 fs-3 text-danger bg-transparent border-0"
  //             onClick={() => showModal(enqState[i]._id)}
  //           >
  //             <AiFillDelete />
  //           </button>
  //         </>
  //       ),
  //     });
  //   }

  //   const setEnquiryStatus = (e, i) => {
  //     const data = { id: i, enqData: e };
  //     dispatch(updateAEnquiry(data));
  //   };

  //   const deleteEnq = (e) => {
  //     dispatch(deleteAEnquiry(e));
  //     setOpen(false);
  //     setTimeout(() => {
  //       dispatch(getEnquiries());
  //     }, 100);
  //   };

  return (
    <div className="mt-4">
      <h3 className="mb-4">Phản hồi</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default CategoryList;
