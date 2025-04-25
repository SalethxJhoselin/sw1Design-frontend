import { io } from "socket.io-client";

const socket = io("http://localhost:3000");  // URL de tu backend

// Opcional: manejar eventos globales de conexión
socket.on("connect", () => {
    console.log("✅ Conectado al servidor WebSocket:", socket.id);
});

socket.on("disconnect", () => {
    console.log("⚠️ Desconectado del servidor WebSocket");
});

export default socket;
