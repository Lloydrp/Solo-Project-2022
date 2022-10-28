import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ChatBar = ({ socket }) => {
  const params = useParams();
  const user = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="os__chatflex h-100 p2 bg-primary text-white">
      <h3 className="text-center">
        {user.organization_array[
          user.organization_array.findIndex(
            (org) => Number(org.organization_id) === Number(params.orgid)
          )
        ]?.organization_name + " Chat"}
      </h3>

      <div>
        <h5 className="mt-3 mb-2 text-center">ACTIVE USERS</h5>
        <div className="os__users mb-2 bg-primary">
          {users.map((user, index) => (
            <p className="text-center" key={index}>
              {user.full_name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
