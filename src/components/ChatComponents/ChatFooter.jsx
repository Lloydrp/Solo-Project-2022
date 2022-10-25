import React, { useState } from "react";
import { useSelector } from "react-redux";

const ChatFooter = ({ socket, orgid }) => {
  const user = useSelector((store) => store.user);
  const [message, setMessage] = useState("");

  function handleTyping() {
    return socket.emit("typing", {
      organization_id: orgid,
      message: `${user.first_name} ${user.last_name} is typing`,
    });
  }

  function handleSendMessage(event) {
    event.preventDefault();
    if (message.trim() && user.id) {
      socket.emit("message", {
        message: message,
        user_sent_id: user.id,
        organization_id: orgid,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  }

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
