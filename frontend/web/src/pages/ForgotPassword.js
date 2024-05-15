import React from "react";
import CustomInput from "../components/CustomInput";

const ForgotPassword = () => {
  return (
    <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Quên Mật Khẩu</h3>
        <p className="text-center">
          Nhập email để nhận được tin nhắn đặt lại mật khẩu
        </p>
        <form action="">
          <CustomInput type="text" label="Email" id="email" />
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
