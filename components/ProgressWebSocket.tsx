// components/ProgressWebSocket.tsx
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ProgressWebSocket = () => {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-progress"); // địa chỉ Spring Boot WebSocket
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        stompClient.subscribe("/topic/progress", (message) => {
          const progress = JSON.parse(message.body);
          console.log("📦 Progress update:", progress);
          // TODO: update UI here
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error", frame);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return null; // hoặc hiển thị UI nếu muốn
};

export default ProgressWebSocket;
