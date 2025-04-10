import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ProgressWebSocket = () => {
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setfileName] = useState<String>("");
  const [fileID, setFileID] = useState<String>("");
  const [isDone, SetIsDone] = useState<boolean>(false);
  // State lưu trữ tiến trình

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new SockJS("http://localhost:8080/ws-progress"); // Địa chỉ WebSocket Spring Boot
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Cấu hình lại khi kết nối bị mất
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        stompClient.subscribe("/topic/progress", (message) => {
          const progressData = JSON.parse(message.body);
          console.log("📦 Progress update:", progressData);
          setProgress(1);

          // Cập nhật tiến trình khi có thông báo mới
          if (progressData && progressData.processed !== undefined) {
            setProgress(progressData.processed); // Cập nhật tiến trình
          }
          if (progressData && progressData.fileName !== undefined) {
            setfileName(progressData.fileName); // Cập nhật tiến trình
          }

          if (progressData && progressData.fileId !== undefined) {
            setFileID(progressData.fileId); // Cập nhật tiến trình
          }
          if (progressData && progressData.done !== undefined) {
            SetIsDone(progressData.done); // Cập nhật tiến trình
          }
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error", frame);
      },
    });

    stompClient.activate(); // Kích hoạt kết nối

    // Clean up WebSocket khi component bị unmount
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div>
      <h3>File Import Progress</h3>
      <div>
        {isDone ? (
          "Đã hoàn thành"
        ) : (
          <div
            style={{
              width: "100%",
              backgroundColor: "#e0e0e0",
              borderRadius: "10px",
              height: "30px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "#4caf50",
                height: "100%",
                borderRadius: "10px",
                textAlign: "center",
                color: "white",
                lineHeight: "30px",
              }}
            >
              {progress}% {/* Hiển thị tiến trình */}
            </div>
          </div>
        )}
      </div>

      {/* <p>{progress === 100 ? "Completed!" : "Processing..."}</p> */}
      <p>
        <span> MÃ ID: {fileID}</span> <br />
        <span> Tên File: {fileName}</span>
      </p>
    </div>
  );
};

export default ProgressWebSocket;
