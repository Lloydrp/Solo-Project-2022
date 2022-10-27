import { useState } from "react";
import { useSelector } from "react-redux";
import UserEmailUpdateForm from "../UserEmailUpdateForm/UserEmailUpdateForm";
import UserUpdatePassForm from "../UserUpdatePassForm/UserUpdatePassForm";
import UserUpdateUsernameForm from "../UserUpdateUsernameForm/UserUpdateUsernameForm";
import Card from "react-bootstrap/Card";

function UserEdit({ setToggleEditUser }) {
  // Setup redux variables
  const user = useSelector((store) => store.user);
  // Setup local state for inputs, toggles, and check availability
  const [toggleUsername, setToggleUsername] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleEmail, setToggleEmail] = useState(false);

  return (
    <section className="d-flex flex-column w-100">
      <Card
        className="w-100 shadow"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center border-bottom">Edit Your Info</h2>
        <div className="p-1 d-flex flex-column align-items-center border-bottom w-100">
          Username: {user.username}
          {toggleUsername ? (
            <UserUpdateUsernameForm setToggleUsername={setToggleUsername} />
          ) : (
            <button
              className="btn btn-sm shadow btn-info mb-3"
              onClick={() => setToggleUsername(true)}
            >
              Change Username
            </button>
          )}
        </div>
        <div className="p-1 d-flex flex-column align-items-center border-bottom w-100 mt-3">
          {togglePassword ? (
            <UserUpdatePassForm setTogglePassword={setTogglePassword} />
          ) : (
            <button
              className="btn btn-sm shadow btn-info mb-3"
              onClick={() => setTogglePassword(true)}
            >
              Change Password
            </button>
          )}
        </div>
        <div className="p-1 d-flex flex-column align-items-center mt-3">
          <div className="text-center">Email: {user.email}</div>
          {toggleEmail ? (
            <UserEmailUpdateForm setToggleEmail={setToggleEmail} />
          ) : (
            <div
              className="btn btn-sm shadow btn-info mb-3"
              onClick={() => setToggleEmail(true)}
            >
              Change Email
            </div>
          )}
        </div>
      </Card>
      <div
        className="d-flex flex-column align-items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="shadow btn btn-outline-secondary mt-3  mb-3"
          onClick={() => setToggleEditUser(false)}
        >
          Back to Profile
        </button>
      </div>
    </section>
  );
}

export default UserEdit;
