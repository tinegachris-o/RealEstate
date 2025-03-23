import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  // Determine WebSocket URL based on environment

  const SOCKET_URL = "http://localhost:8000";


  useEffect(() => {
    const newSocket = io(SOCKET_URL, { withCredentials: true });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [SOCKET_URL]);

  useEffect(() => {
    if (currentUser && socket) {
      socket.emit("newUser", currentUser.id);
    }
  }, [currentUser, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
