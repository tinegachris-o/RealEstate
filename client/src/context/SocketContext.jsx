import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
export const SocketContext = createContext();
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  useEffect(()=>{
currentUser&&socket?.emit("newUser",currentUser?.userInfo?.id)
  },[currentUser,socket])
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
