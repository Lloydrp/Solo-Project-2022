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
        user_sent_id:
          user.organization_array[
            user.organization_array.findIndex(
              (org) => Number(org.organization_id) === Number(orgid)
            )
          ]?.id,
        organization_id: orgid,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage("");
  }

  return (
    <div className="os__footervh p-1 bg-primary">
      <form
        className="w-100 h-100 d-flex align-items-center justify-content-around"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="Write message"
          className="os__messagebox h-100 rounded border-light p-2"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleTyping}
        />
        <button className="os__sendbtn btn btn-light h-100 p-2">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;
