// Chat.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      setMessage("");
    });

    return () => {
      socket.off("receive_message");
    };
  }, [message]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const msgData = {
      username,
      message,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("send_message", msgData);
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="user-input">
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10, display: "block" }}
        />
      </div>
      <div className="card">
        <div id="header">
          <h1>Chatter box!</h1>
        </div>

        <div id="message-section">
        {chat.map((data, index) => (
          <div className={`message-container ${username === data.username ? "message-right" : "message-left"}`}>
              <span id="bot-name">{data.username}</span>
              <div className={username === data.username ? "message right" : "message left"}  id="bot" key={index}>
                <span id="bot-response">{data.message}</span>
              </div>
            </div>

        ))}
        </div>

        <div id="input-section">
        <input
          id="input"
          type="text"
          placeholder="Type a message"
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
          <button className="send" onClick={sendMessage}>
            <div className="circle">
              <i className="zmdi zmdi-mail-send"></i>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
