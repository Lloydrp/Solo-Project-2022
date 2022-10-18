import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Nav from "../../Nav/Nav";
import ChatWrapper from "../../ChatComponents/ChatWrapper";

function ChatPage({ socket }) {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

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

  return (
    <>
      <Nav orgid={params.orgid} />
      <ChatWrapper socket={socket} />
    </>
  );
}

export default ChatPage;
