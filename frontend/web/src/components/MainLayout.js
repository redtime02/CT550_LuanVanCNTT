import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import {
  AiOutlineDashboard,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineBgColors,
  AiOutlinePicLeft,
  AiOutlinePicRight,
} from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import { RiCouponLine } from "react-icons/ri";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Link, Outlet } from "react-router-dom";
import { BiCategoryAlt, BiNews } from "react-icons/bi";
import { FaClipboardList, FaBloggerB } from "react-icons/fa";
import { ImBlog } from "react-icons/im";
import { IoIosNotifications } from "react-icons/io";
import { GoCodeReview } from "react-icons/go";
import { GrCatalogOption } from "react-icons/gr";
import { SiBrandfolder } from "react-icons/si";
import { Layout, Menu, Button, theme } from "antd";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">Z</span>
            <span className="lg-logo">Zero</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          onClick={({ key }) => {
            if (key === "signout") {
              localStorage.clear();
              window.location.reload();
            } else {
              navigate(key);
            }
          }}
          items={[
            {
              key: "",
              icon: <AiOutlineDashboard className="fs-4" />,
              label: "Bảng điều khiển",
            },
            {
              key: "user",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Người dùng",
            },
            {
              key: "customer",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Người thu gom",
              children: [
                {
                  key: "add-customer",
                  icon: <ImBlog className="fs-4" />,
                  label: "Thêm tài khoản",
                },
                {
                  key: "customers",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Danh sách tài khoản",
                },
              ],
            },
            {
              key: "catalog",
              icon: <GrCatalogOption className="fs-4" />,
              label: "Mục lục",
              children: [
                {
                  key: "add-product",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Thêm ve chai",
                },
                {
                  key: "product-list",
                  icon: <AiOutlineShoppingCart className="fs-4" />,
                  label: "Danh sách ve chai",
                },
                {
                  key: "brand",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Thêm phần thưởng",
                },
                {
                  key: "brand-list",
                  icon: <SiBrandfolder className="fs-4" />,
                  label: "Danh sách phần thưởng",
                },
                // {
                //   key: "category",
                //   icon: <BiCategoryAlt className="fs-4" />,
                //   label: "Thêm danh mục",
                // },
                // {
                //   key: "category-list",
                //   icon: <BiCategoryAlt className="fs-4" />,
                //   label: "Danh sách danh mục",
                // },
                // {
                //   key: "color",
                //   icon: <AiOutlineBgColors className="fs-4" />,
                //   label: "Thêm màu sắc",
                // },
                // {
                //   key: "color-list",
                //   icon: <AiOutlineBgColors className="fs-4" />,
                //   label: "Danh sách màu sắc",
                // },
              ],
            },
            {
              key: "location",
              icon: <AiOutlineUser className="fs-4" />,
              label: "Địa điểm",
              children: [
                {
                  key: "un-location",
                  icon: <ImBlog className="fs-4" />,
                  label: "Danh sách địa điểm chưa thu nhặt",
                },
                // {
                //   key: "customers",
                //   icon: <FaBloggerB className="fs-4" />,
                //   label: "Danh sách tài khoản",
                // },
              ],
            },
            // {
            //   key: "order",
            //   icon: <FaClipboardList className="fs-4" />,
            //   label: "Đơn hàng",
            // },
            {
              key: "blogs",
              icon: <BiNews className="fs-4" />,
              label: "Thông báo",
              children: [
                {
                  key: "blog",
                  icon: <ImBlog className="fs-4" />,
                  label: "Thêm thông báo",
                },
                {
                  key: "blog-list",
                  icon: <FaBloggerB className="fs-4" />,
                  label: "Danh sách thông báo",
                },
                // {
                //   key: "blog-category",
                //   icon: <ImBlog className="fs-4" />,
                //   label: "Thêm danh mục tin tức",
                // },
                // {
                //   key: "blog-category-list",
                //   icon: <FaBloggerB className="fs-4" />,
                //   label: "Danh sách danh mục tin tức",
                // },
              ],
            },
            {
              key: "marketing",
              icon: <RiCouponLine className="fs-4" />,
              label: "Bảng xếp hạng",
              children: [
                {
                  key: "coupon",
                  icon: <ImBlog className="fs-4" />,
                  label: "Xếp hạng đánh dấu",
                },
                {
                  key: "coupon-list",
                  icon: <RiCouponLine className="fs-4" />,
                  label: "Xếp hạng thu nhặt",
                },
              ],
            },
            {
              key: "enquiries",
              icon: <GoCodeReview className="fs-4" />,
              label: "Phản hồi",
            },
            {
              key: "reports",
              icon: <GoCodeReview className="fs-4" />,
              label: "Báo cáo",
            },
            {
              key: "signout",
              icon: <CiLogout className="fs-4" />,
              label: "Đăng xuất",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{ padding: 0, background: colorBgContainer }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuUnfoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="d-flex gap-4 align-items-center">
            <div className="position-relative">
              <IoIosNotifications className="fs-4" />
              <span className="badge bg-danger rounded-circle p-1 position-absolute">
                3
              </span>
            </div>
            <div className="d-flex gap-3 align-items-center dropdown">
              <div>
                <img
                  width={32}
                  height={32}
                  src="https://th.bing.com/th/id/R.9dcce93126baf5a0c95981a2d2d2aa82?rik=044obY0D36%2beug&pid=ImgRaw&r=0"
                  alt=""
                />
              </div>
              <div
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <h5 className="mb-0">Admin</h5>
                <p className="mb-0">admin@gmail.com</p>
              </div>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="#"
                  >
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item py-1 mb-1"
                    style={{ height: "auto", lineHeight: "20px" }}
                    to="#"
                  >
                    Đăng xuất
                  </Link>
                </li>
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {/* <ToastContainer
            position="top-right"
            autoClose={250}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
          /> */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
