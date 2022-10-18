import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";
import { useSelector } from "react-redux";

function Nav({ orgid }) {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <NavLink to="/home">
        <h2 className="nav-title">Organization Station</h2>
      </NavLink>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <NavLink className="navLink" to="/login">
            Login / Register
          </NavLink>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <NavLink
              to={`/resources/${orgid}`}
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Resources
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
              to={`/schedule/${orgid}`}
            >
              Schedule
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
              to={`/chat/${orgid}`}
            >
              Chat
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
              to={`/user/${orgid ? orgid : ""}`}
            >
              User (Insert Icon)
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
