import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
  const history = useHistory();
  const user = useSelector((store) => store.user);

  return (
    <>
      <header className="chat__mainHeader">
        <p>Organization Chat</p>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          Number(message.user_sent_id) === Number(user.id) ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.message}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.message}</p>
              </div>
            </div>
          )
        )}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
