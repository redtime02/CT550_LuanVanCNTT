import React from "react";
import CustomInput from "../components/CustomInput";

const ResetPassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Đặt Lại Mật Khẩu</h3>
        <p className="text-center">Nhập mật khẩu mới của bạn để thay đổi</p>
        <form action="">
          <CustomInput type="password" label="Mật khẩu" id="pass" />
          <CustomInput type="password" label="Xác nhận mật khẩu" id="pass" />
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Đặt lại
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
