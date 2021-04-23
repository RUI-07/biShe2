import "./styles.css";
import { Layout, Space, Card, Typography, Input } from "antd";
import { VideoCameraTwoTone } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

const { Title, Text } = Typography;

export default function App() {
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header>
        <div style={{ color: "white", fontSize: "20px" }}>
          <Space size="middle">
            <VideoCameraTwoTone />
            在线授课系统
          </Space>
        </div>
      </Header>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh"
        }}
      >
        <Card style={{ width: "500px", height: "300px", margin: "32px" }}>
          <Space direction="vertical">
            <Title level={4}>基本信息</Title>
            <div style={{ fontSize: "16px" }}>
              个人ID：<Text type="secondary">1323424444</Text>
            </div>
            <div style={{ fontSize: "16px" }}>
              在线时长：<Text type="secondary">1h36m</Text>
            </div>
          </Space>
        </Card>
        <Card style={{ width: "500px", height: "300px" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>发起聊天</Title>
            <div>
              <Input.Search placeholder="请输入对方的ID" />
            </div>
          </Space>
        </Card>
      </div>
      <Footer
        style={{
          width: "100%",
          textAlign: "center",
          position: "fixed",
          left: "0",
          bottom: "0",
          background: "white"
        }}
      >
        {" "}
        ©2021 Designed by Rui
      </Footer>
    </Layout>
  );
}
