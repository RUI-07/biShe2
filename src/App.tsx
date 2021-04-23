import "./styles.css";
import { Layout, Space, Card, Typography, Input } from "antd";
import {
  VideoCameraTwoTone,
  PhoneOutlined,
  FileOutlined,
  FormOutlined
} from "@ant-design/icons";
import React, { useEffect } from "react";
import { SpaceContext } from "antd/lib/space";
const { Header, Content, Footer } = Layout;

const { Title, Text } = Typography;

export default function App() {
  useEffect(() => {
    const video = document.getElementById("video2") as HTMLVideoElement;
    const videoObj = {
      video: true
    };
    if (navigator.getUserMedia) {
      // Standard
      navigator.getUserMedia(
        videoObj,
        function (stream) {
          video.srcObject = stream;
          video.play();
        },
        () => console.log("error")
      );
    }
  }, []);

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
        <div style={{ margin: "32px" }}>
          <video style={{ width: "100%", height: "100%" }} id="video1" />
        </div>
        <div style={{ margin: "32px" }}>
          <video style={{ width: "100%", height: "100%" }} id="video2" />
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          right: "0",
          bottom: "100px",
          padding: "16px"
        }}
      >
        <Space style={{ width: "100%" }} direction="vertical" size="large">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                color: "white",
                width: "48px",
                height: "48px",
                background: "#1890ff",
                borderRadius: "100%",
                marginRight: "16px"
              }}
            >
              <PhoneOutlined />
            </div>
            挂断通话
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                color: "white",
                width: "48px",
                height: "48px",
                background: "#1890ff",
                borderRadius: "100%",
                marginRight: "16px"
              }}
            >
              <FormOutlined />
            </div>
            开启白板
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                color: "white",
                width: "48px",
                height: "48px",
                background: "#1890ff",
                borderRadius: "100%",
                marginRight: "16px"
              }}
            >
              <FileOutlined />
            </div>
            发送文件
          </div>
        </Space>
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
