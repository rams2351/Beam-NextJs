import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

// Load environment variables (Make sure to point to your main .env file or copy secrets)
dotenv.config({ path: "../.env.local" });
const app = express();
app.use(
  cors({
    origin: ["*"],
  })
);

const server = http.createServer(app);

// Initialize Socket.io with CORS allowing your Next.js frontend
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ------------------------------------------------------------------
// MIDDLEWARE: Authentication
// ------------------------------------------------------------------
// This runs BEFORE a user connects. If the token is invalid, they get blocked.
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    // Verify using the SAME secret as your Next.js app
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    // Attach user data to the socket instance for later use
    (socket as any).user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// ------------------------------------------------------------------
// EVENT HANDLERS
// ------------------------------------------------------------------
io.on("connection", (socket) => {
  const user = (socket as any).user;
  console.log(`✅ User connected: ${user.name} (${user._id})`);

  // 1. Join a specific Conversation Room
  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`User ${user._id} joined room: ${conversationId}`);
  });

  // 2. Leave a Conversation Room
  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
  });

  // 3. Handle Typing Events
  socket.on("typing", (conversationId: string) => {
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(conversationId).emit("user_typing", { userId: user._id, conversationId });
  });

  socket.on("stop_typing", (conversationId: string) => {
    socket.to(conversationId).emit("user_stop_typing", { userId: user._id, conversationId });
  });

  // 4. Handle New Message (Real-time relay)
  // NOTE: In our architecture, we save to DB via Next.js API first,
  // then the client emits this event to update others.
  socket.on("new_message", (data: any) => {
    const { conversationId, message } = data;
    // Broadcast to everyone in the room INCLUDING sender (or exclude if you optimize UI locally)
    io.to(conversationId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${user._id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Beam Socket Server running on port ${PORT}`);
});
