// @ts-nocheck
import "./styles.css";
import {
  Layout,
  Space,
  Card,
  Typography,
  Input,
  message,
  Modal,
  Button,
} from "antd";
import {
  VideoCameraTwoTone,
  PhoneOutlined,
  FileOutlined,
  FormOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SpaceContext } from "antd/lib/space";
import { connOption } from "./config";
import Peer from "peerjs";
import CanvasDraw from "react-canvas-draw";
const { Header, Content, Footer } = Layout;

const { Title, Text } = Typography;

const key = "key" + Math.floor(Math.random() * 1000000);
let myPeer: any;
let globalConn: any;
let canvasReadFlag = 0;
let canvasDrawFlag = 0;
// @ts-ignore

export default function App() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const [whiteBoard, setWhiteBoard] = useState(false);
  const canvas = useRef(null);

  const handleCall = useCallback(
    (call?: any) => {
      console.log("handleCall", call);
      !isConnecting && setIsConnecting(true);
      const mediaObj = {
        video: true,
        audio: true,
      };
      navigator.getUserMedia(
        mediaObj,
        function (stream) {
          try {
            const videoLocal: any = document.getElementById("video1");
            if (videoLocal) {
              videoLocal.srcObject = stream;
              videoLocal.play();
            }
            if (!call) call = myPeer.call(inputValue, stream);
            else call.answer(stream);
            call.on("stream", (stream: any) => {
              const videoRemote: any = document.getElementById("video2");
              if (videoRemote) {
                videoRemote.srcObject = stream;
                videoRemote.play();
              }
            });
          } catch {
            console.error("video play error");
          }
        },
        () => console.log("error")
      );
      return call;
    },
    [inputValue, isConnecting]
  );

  // @ts-ignore
  const handleReceive = (conn) => (data) => {
    try {
      console.log("receive data: ", data, "type:" + data.type);
      if (data.type === "conn_build") {
        Modal.confirm({
          title: "??????????????????",
          content: "??????" + data.payload.key + "???????????????",
          onCancel: () => {
            conn.send({ type: "refuse" });
            setTimeout(() => conn.close(), 1000);
          },
          onOk: () => {
            conn.send({ type: "comfirm" });
          },
        });
      } else if (data.type === "comfirm") {
        console.log("comfirm");
        message.success("?????????????????????");
        handleCall();
      } else if (data.type === "refuse") {
        message.error("?????????????????????");
        setInputValue(undefined);
        setTimeout(() => conn.close(), 1000);
      } else if (data.type === "close") {
        message.error("???????????????");
        setInputValue(undefined);
        setTimeout(() => conn.close(), 1000);
      } else if (data.type === "white") {
        setWhiteBoard(data.payload);
      } else if (data.type === "draw") {
        canvas.current.loadSaveData(data.payload.data, true);
      }
    } catch {
      console.log("???????????????????????????");
    }
  };

  useEffect(() => {
    if (!myPeer) {
      myPeer = new Peer(key, connOption as any);
      console.log("test", myPeer);
      myPeer.on("error", () => {
        message.error("?????????????????????");
      });
      myPeer.on("open", () => {
        console.log("??????????????????");
      });
      myPeer.on("call", (call: any) => {
        handleCall(call);
      });
      // @ts-ignore
      myPeer.on("connection", (conn) => {
        globalConn = conn;
        // @ts-ignore
        conn.on("data", handleReceive(conn));
      });
      myPeer.on("close", () => {
        message.error("???????????????");
      });
    }
  }, []);
  useEffect(() => {
    let conn: any;
    if (inputValue) {
      conn = myPeer.connect(inputValue);
      conn.on("error", () => {
        message.error("????????????");
      });
      conn.on("open", () => {
        console.log("?????????????????????");
        conn.send({
          type: "conn_build",
          payload: {
            key: key,
          },
        });
      });
      globalConn = conn;
      // @ts-ignore
      conn.on("data", handleReceive(conn));
    }
    return () => {
      console.log("inputValue hook clean", conn);
      if (conn) {
        conn.send({ type: "close" });
        setTimeout(() => {
          conn.close();
        }, 1000);
      }
    };
  }, [inputValue]);
  useEffect(() => {
    if (!inputValue) {
      const videoLocal: any = document.getElementById("video1");
      const videoRemote: any = document.getElementById("video2");
      videoLocal.pause();
      videoRemote.pause();
      isConnecting && setIsConnecting(false);
    }
  }, [inputValue]);
  return (
    <>
      <div
        style={{
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.5)",
          display: whiteBoard ? "" : "none",
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CanvasDraw
          ref={(value) => (canvas.current = value)}
          lazyRadius={5}
          brushRadius={2}
          hideGrid
          style={{ width: "100vw", height: "100vh", background: "none" }}
          onDrawEnd={() => {
            console.log(canvas.current.getSaveData());
            globalConn?.send({
              type: "draw",
              payload: {
                data: canvas.current.getSaveData(),
              },
            });
          }}
        />
      </div>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Header>
          <div style={{ color: "white", fontSize: "20px" }}>
            <Space size="middle">
              <VideoCameraTwoTone />
              ??????????????????
              <Button
                onClick={() => document.documentElement.requestFullscreen()}
              >
                ??????
              </Button>
            </Space>
          </div>
        </Header>
        <div
          className="panel"
          style={{
            display: !isConnecting ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Card style={{ width: "500px", height: "300px", margin: "32px" }}>
            <Space direction="vertical">
              <Title level={4}>????????????</Title>
              <div style={{ fontSize: "16px" }}>
                ??????ID???<Text type="secondary">{key}</Text>
              </div>
              <div style={{ fontSize: "16px" }}>
                ???????????????<Text type="secondary">{"<10??????"}</Text>
              </div>
            </Space>
          </Card>
          <Card style={{ width: "500px", height: "300px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={4}>????????????</Title>
              <div>
                <Input.Search
                  onSearch={(value) => setInputValue(value)}
                  placeholder="??????????????????ID"
                />
              </div>
            </Space>
          </Card>
        </div>
        <div className="videos" style={{ display: isConnecting ? "" : "none" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
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
              zIndex: 100,
              position: "fixed",
              right: "0",
              bottom: "100px",
              padding: "16px",
            }}
          >
            <Space style={{ width: "100%" }} direction="vertical" size="large">
              <div
                onClick={() => {
                  // setInputValue(undefined);
                  window.location.reload();
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    marginRight: "16px",
                  }}
                >
                  <PhoneOutlined />
                </div>
                ????????????
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    marginRight: "16px",
                  }}
                  onClick={() => {
                    setWhiteBoard((value) => {
                      globalConn.send({ type: "white", payload: !value });
                      return !value;
                    });
                  }}
                >
                  <FormOutlined />
                </div>
                ????????????
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                    marginRight: "16px",
                  }}
                >
                  <FileOutlined />
                </div>
                ????????????
              </div>
            </Space>
          </div>
        </div>
        <Footer
          style={{
            width: "100%",
            textAlign: "center",
            position: "fixed",
            left: "0",
            bottom: "0",
            background: "white",
          }}
        >
          {" "}
          ??2021 Designed by Rui
        </Footer>
      </Layout>
    </>
  );
}
