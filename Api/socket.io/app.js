import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const io = new Server({
  cors: {
    origin: [
      "http://localhost:5173", // allow local dev
      process.env.CLIENT_URL, // allow Netlify domain from .env
    ],
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
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
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// read port from .env or fallback to 8000
const SOCKET_PORT = process.env.SOCKET_PORT || 8000;
io.listen(SOCKET_PORT);
console.log(`Socket.io server listening on port ${SOCKET_PORT}`);
