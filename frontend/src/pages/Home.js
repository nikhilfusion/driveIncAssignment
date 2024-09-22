import React from 'react';
import { Layout, Row, Col, Typography, Button } from 'antd';
import ScheduleForm from '../components/ScheduleForm';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      {/* Banner Section */}
      <div style={{ backgroundImage: 'url("https://www.tesla.com/sites/default/files/modelsx-new/social/model-s-hero-social.jpg")', backgroundSize: 'cover', padding: '50px', textAlign: 'center', color: 'white' }}>
        <Title style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>Drive the Future</Title>
        <Paragraph style={{ fontSize: '20px' }}>
          Schedule your test drive today and experience cutting-edge electric vehicles firsthand.
        </Paragraph>
        <Button type="primary" size="large">Learn More</Button>
      </div>

      {/* Main Content Section */}
      <Content style={{ padding: '50px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div>
              <Title level={2}>Why Schedule a Test Drive?</Title>
              <Paragraph>
                Get behind the wheel of the latest electric cars. Whether it's Tesla or Volkswagen, experience the thrill of innovative technology and exceptional performance.
              </Paragraph>
              <Paragraph>
                Select your preferred vehicle and schedule a convenient time to test drive.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            {/* Test Drive Scheduling Form */}
            <ScheduleForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
