import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

// Import your routes
import authRoutes from "./routes/auth.route.js";
import testRoutes from "./routes/test.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";

// Create the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(cookieParser());

// Attach your routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Create a single HTTP server from the Express app
const server = http.createServer(app);

// Attach Socket.io to the same server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Socket.io logic
let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  // Listen for new user
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  // Listen for sendMessage
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // Handle socket disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("Socket disconnected:", socket.id);
  });
});

// Listen on one port (use Render's port or fallback to 8080 for local dev)
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server (Express + Socket.io) is running on port ${port}`);
});
