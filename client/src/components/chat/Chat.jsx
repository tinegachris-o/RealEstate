import { useContext, useState, useRef, useEffect } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import server from "../../lib/axios";
import { format } from "timeago.js";
import EmojiPicker from "emoji-picker-react";
import { SocketContext } from "../../context/SocketContext";
import useNotificationStore from "../../lib/notificationStore";
import { BsSend } from "react-icons/bs";

function Chat({ chats }) {
  const decrease = useNotificationStore((state) => state.decrease);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await server("/chats/" + id);
      if (!res.data.seenBy.includes(currentUser?.userInfo?.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log("Error opening chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await server.post("/messages/" + chat.id, { text });

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));

      setText(""); // Clear input
      setShowEmojiPicker(false); // Optionally close picker

      if (!chat?.receiver?.id) {
        console.warn("Cannot send message: receiver not set.");
        return;
      }

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await server.put("/chats/read/" + chat.id);
      } catch (error) {
        console.log(error);
      }
    };

    if (socket && chat) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          read();
        }
      });
    }

    return () => {
      socket?.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser?.userInfo?.id) ||
                chat?.id === c.id
                  ? "white"
                  : "yellow",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/user.png"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c?.lastMessage}</p>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/user.png"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>

          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                key={message.id}
                style={{
                  alignSelf:
                    message.userId === currentUser?.userInfo?.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser?.userInfo?.id
                      ? "right"
                      : "left",
                }}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <div className="emoji-container">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      setText((prev) => prev + emojiData.emoji)
                    }
                  />
                </div>
              )}
            </div>
            <textarea
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">
              <BsSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
