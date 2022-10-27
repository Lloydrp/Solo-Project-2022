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
    <>
      <Card body className="w-100" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-center">Edit Your Info</h2>
        <div className="d-flex flex-column align-items-center">
          Username: {user.username}
          {toggleUsername ? (
            <UserUpdateUsernameForm setToggleUsername={setToggleUsername} />
          ) : (
            <button
              className="btn btn-primary mb-3"
              onClick={() => setToggleUsername(true)}
            >
              Change Username
            </button>
          )}
        </div>
        <div className="d-flex flex-column align-items-center">
          {togglePassword ? (
            <UserUpdatePassForm setTogglePassword={setTogglePassword} />
          ) : (
            <button
              className="btn btn-primary mb-3"
              onClick={() => setTogglePassword(true)}
            >
              Change Password
            </button>
          )}
        </div>
        <div className="d-flex flex-column align-items-center">
          Email: {user.email}
          {toggleEmail ? (
            <UserEmailUpdateForm setToggleEmail={setToggleEmail} />
          ) : (
            <div
              className="btn btn-primary mb-3"
              onClick={() => setToggleEmail(true)}
            >
              Change Email
            </div>
          )}
        </div>
        <div className="d-flex flex-column align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setToggleEditUser(false)}
          >
            Back to Profile
          </button>
        </div>
      </Card>
    </>
  );
}

export default UserEdit;
