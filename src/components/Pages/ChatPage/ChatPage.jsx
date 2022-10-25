import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { useHistory, useParams } from "react-router-dom";
import Nav from "../../Nav/Nav";
import ChatWrapper from "../../ChatComponents/ChatWrapper";

function ChatPage() {
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const socket = socketIO.connect("http://10.39.20.27:3000");

  socket.on("connect", () =>
    socket.emit("newUser", {
      user: user.id,
      full_name: `${user.first_name} ${user.last_name}`,
      organization_id: params.orgid,
      socketID: socket.id,
    })
  );

  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: params.orgid } });
  }, []);

  useEffect(() => {
    return () => socket.emit("leftChat");
  }, [socket]);

  return (
    <>
      <Nav orgid={params.orgid} />
      <ChatWrapper socket={socket} orgid={params.orgid} />
    </>
  );
}

export default ChatPage;
