import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatBody = ({ messages, lastMessageRef, typingStatus }) => {
  const user = useSelector((store) => store.user);
  const orgUsers = useSelector((store) => store.organization.orgUsers);
  const params = useParams();
  const dispatch = useDispatch();

  // Begin function to convert time
  function convertTimeFormat(time) {
    const year = time.slice(0, 4);
    const month = time.slice(5, 7);
    const day = time.slice(8, 10);
    return `${month}-${day}-${year}`;
  } // End convertTimeFormat

  useEffect(() => {
    dispatch({
      type: "FETCH_ORG_USERS",
      payload: {
        id: params.orgid,
      },
    });
  }, []);

  return (
    <>
      <div className="os__chatbodyvh px-2 bg-light overflow-scroll w-100">
        {messages.map((message, index) => {
          return Number(message.user_sent_id) === Number(user.id) ? (
            <div className="os__chatsize" key={message.id}>
              {messages[index]?.date_sent !==
                messages[index - 1 > 0 ? index - 1 : 0]?.date_sent && (
                <p key={index ** 3} className="text-center">
                  {"Sent " + convertTimeFormat(messages[index]?.date_sent)}
                </p>
              )}
              <p className="os__alignright">You</p>
              <div className="os__sender bg-success rounded p-2 ms-auto">
                <p>{message.message}</p>
              </div>
            </div>
          ) : (
            <div className="os__chatsize" key={message.id}>
              {messages[index]?.date_sent !==
                messages[index - 1 > 0 ? index - 1 : 0]?.date_sent && (
                <p key={index ** 3} className="text-center">
                  {"Sent " + convertTimeFormat(messages[index]?.date_sent)}
                </p>
              )}
              <p>
                {orgUsers?.length > 0 &&
                  orgUsers[
                    orgUsers?.findIndex(
                      (user) =>
                        Number(user?.user_id) === Number(message.user_sent_id)
                    )
                  ]?.first_name}{" "}
                {
                  orgUsers[
                    orgUsers?.findIndex(
                      (user) =>
                        Number(user?.user_id) === Number(message.user_sent_id)
                    )
                  ]?.last_name
                }
              </p>
              <div className="os__received bg-info p-2 rounded">
                <p>{message.message}</p>
              </div>
            </div>
          );
        })}

        <div className="position-fixed typing__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
