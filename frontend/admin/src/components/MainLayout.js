"use client";

import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { AiOutlineDashboard } from "react-icons/ai";

const { Header, Sider, Content } = Layout;

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Lưu trạng thái của 'collapsed' vào localStorage khi nó thay đổi
    localStorage.setItem("collapsed", collapsed);
  }, [collapsed]);

  useEffect(() => {
    // Khởi tạo 'collapsed' từ localStorage khi component render lại
    const collapsedState = localStorage.getItem("collapsed") === "true";
    setCollapsed(collapsedState);
  }, []);

  useEffect(() => {
    // Xác định key dựa trên đường dẫn hiện tại và cập nhật selectedKey
    const { pathname } = router;
    switch (pathname) {
      case "/":
        setSelectedKey("");
        break;
      case "/user":
        setSelectedKey("user");
        break;
      case "/location":
        setSelectedKey("location");
        break;
      case "/trashtype":
        setSelectedKey("trashtype");
        break;
      case "/bonus":
        setSelectedKey("bonus");
        break;
      case "/reward":
        setSelectedKey("reward");
        break;
      case "/feedback":
        setSelectedKey("feedback");
        break;
      default:
        setSelectedKey("");
        break;
    }
  }, [router.pathname]);

  return (
    <Layout className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* Các mục menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Sử dụng selectedKeys để xác định mục menu được chọn
        >
          <Menu.Item key="" icon={<AiOutlineDashboard />}>
            <Link href="/">Bảng điều khiển</Link>
          </Menu.Item>
          <Menu.Item key="user" icon={<UserOutlined />}>
            <Link href="/user">Tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="location" icon={<VideoCameraOutlined />}>
            <Link href="/location">Địa điểm</Link>
          </Menu.Item>
          <Menu.Item key="trashtype" icon={<VideoCameraOutlined />}>
            <Link href="/trashtype">Loại ve chai</Link>
          </Menu.Item>
          <Menu.Item key="bonus" icon={<VideoCameraOutlined />}>
            <Link href="/bonus">Vật thưởng</Link>
          </Menu.Item>
          <Menu.Item key="reward" icon={<VideoCameraOutlined />}>
            <Link href="/reward">Danh sách nhận thưởng</Link>
          </Menu.Item>
          <Menu.Item key="feedback" icon={<VideoCameraOutlined />}>
            <Link href="/feedback">Phản hồi</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
