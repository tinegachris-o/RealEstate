import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http"; // <-- Needed to create HTTP server
import { Server } from "socket.io"; // <-- Socket.IO

dotenv.config();
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
const port = process.env.PORT;
app.use(express.json());

////middleware
//console.log(`hello ${username} ukoaje?`)
//create ahttp server and attach express app
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // e.g., http://localhost:5173
    credentials: true,
  },
});
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute);
app.use("/api/chats", chatRoute);
app.use("/api/users", userRoute);

//Online users
let onlineUser = [];
/////adding user

const addUSer = (userId, socketId) => {
  const exists = onlineUser.find((user) => user.userId === userId);
  if (!exists) {
    onlineUser.push({ userId, socketId });
  }
};

///Removing a user
const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((u) => u.socketId !== socketId);
};
//Get A user
const getUser = (userId) => {
  return onlineUser.find((u) => u.userId === userId);
};
io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUSer(userId, socket.id);
    //onlineUser
    console.log("this is my online users:", onlineUser);
  });
  console.log("this is my socket:", socket.id);
  //send message

  //receive message from client

  socket.on("sendMessage", ({ receiverId, data }) => {
    //console.log("message received from client", data);
    //console.log("this is my receiver id", receiverId);
    const receiver = getUser(receiverId);
    //send message to client
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("❌ A user disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server and Socket.IO listening on port ${port}`);
});
////
