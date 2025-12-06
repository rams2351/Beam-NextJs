import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";
class SocketService {
  public socket: Socket | null = null;

  // 1. Initialize Connection
  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("⚡ Connected to Beam Socket Server", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message);
    });
  }

  // 2. Disconnect (Cleanup)
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 3. Room Management
  joinRoom(conversationId: string) {
    this.socket?.emit("join_conversation", conversationId);
  }

  leaveRoom(conversationId: string) {
    this.socket?.emit("leave_conversation", conversationId);
  }

  // 4. Messaging
  sendMessage(conversationId: string, message: any) {
    this.socket?.emit("new_message", { conversationId, message });
  }

  sendTyping(conversationId: string) {
    this.socket?.emit("typing", conversationId);
  }

  sendStopTyping(conversationId: string) {
    this.socket?.emit("stop_typing", conversationId);
  }

  // 5. Listeners (For components to subscribe)
  // generic generic type <T> allows us to type the response data
  on<T>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

// Export a single instance (Singleton Pattern)
const socketService = new SocketService();
export default socketService;
