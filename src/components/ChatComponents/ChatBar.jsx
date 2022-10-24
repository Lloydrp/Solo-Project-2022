import React, { useEffect, useState } from "react";

const ChatBar = ({ socket }) => {
  const [users, setUsers] = useState([]);
  console.log("users :>> ", users);

  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div className="chat__users">
          {users.map((user) => (
            <p key={user.socketID}>{user.full_name}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;
