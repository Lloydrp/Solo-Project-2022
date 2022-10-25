import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ChatBar from "../ChatComponents/ChatBar";
import ChatBody from "../ChatComponents/ChatBody";
import ChatFooter from "../ChatComponents/ChatFooter";

function ChatPage({ socket, orgid }) {
  const dispatch = useDispatch();
  const messages = useSelector((store) => store.messages);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    dispatch({
      type: "FETCH_MESSAGES",
      payload: {
        organization_id: orgid,
      },
    });
  }, []);

  useEffect(() => {
    socket.on("messageResponse", (data) =>
      dispatch({
        type: "FETCH_MESSAGES",
        payload: {
          organization_id: orgid,
        },
      })
    );
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
        />
        <ChatFooter socket={socket} orgid={orgid} />
      </div>
    </div>
  );
}

export default ChatPage;
