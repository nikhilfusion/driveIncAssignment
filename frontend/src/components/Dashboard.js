import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const location = useLocation(); // Get current location

  // Map the URL path to the corresponding menu key
  const getSelectedKey = (path) => {
    switch (path) {
      case '/reservations':
        return '2';
      case '/vehicles':
        return '3';
      case '/settings':
        return '4';
      default:
        return '1'; // Default to Home
    }
  };

  const selectedKey = getSelectedKey(location.pathname);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" style={{ color: 'white', padding: '16px' }}>
          Test Drive App
        </div>
        <Menu theme="dark" selectedKeys={[selectedKey]}  mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/reservations">Reservations</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CarOutlined />}>
            <Link to="/vehicles">Vehicles</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
      <Header style={{ background: '#001529', padding: '10px 50px' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>Test Drive Scheduler</div>
      </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet /> {/* This is where your pages will render */}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Dashboard ©2024 Created by Nikhil
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
