import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function UserEdit({ orgid, setToggleEditUser }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [toggleUsername, setToggleUsername] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleEmail, setToggleEmail] = useState(false);
  const [changePassword, setChangePassword] = useState("");
  const [changeUsername, setChangeUsername] = useState("");
  const [changeEmail, setChangeEmail] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  function handleSubmitUsername(event) {
    event.preventDefault();

    dispatch({
      type: "CHANGE_USERNAME",
      payload: {
        newUsername: changeUsername,
      },
    });

    setChangeUsername("");
  }

  function handleSubmitPassword(event) {
    event.preventDefault();

    dispatch({
      type: "CHANGE_PASSWORD",
      payload: {
        newPassword: changePassword,
      },
    });

    setChangePassword("");
  }

  function handleSubmitEmail(event) {
    event.preventDefault();

    dispatch({
      type: "CHANGE_EMAIL",
      payload: {
        newEmail: changeEmail,
      },
    });

    setChangeEmail("");
  }

  function handleUsernameInput(event) {
    setChangeUsername(event.target.value);
    setUsernameAvailable(false);
  }

  function handleEmailInput(event) {
    setChangeEmail(event.target.value);
    setEmailAvailable(false);
  }

  function handleUsernameCancel(event) {
    event.preventDefault();
    setToggleUsername(false);
    setChangeUsername("");
  }
  function handlePasswordCancel(event) {
    event.preventDefault();
    setTogglePassword(false);
    setChangePassword("");
  }
  function handleEmailCancel(event) {
    event.preventDefault();
    setToggleEmail(false);
    setChangeEmail("");
  }

  useEffect(() => {
    if (changeUsername) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkusername/${changeUsername}`)
          .then((result) => {
            result.data.length === 0
              ? setUsernameAvailable(true)
              : setUsernameAvailable(false);
          })
          .catch((error) => {
            console.log("error caught in check username :>> ", error);
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [changeUsername]);

  useEffect(() => {
    if (changeEmail) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkemail/${changeEmail}`)
          .then((result) => {
            result.data.length === 0
              ? setEmailAvailable(true)
              : setEmailAvailable(false);
          })
          .catch((error) => {
            console.log("error caught in check username :>> ", error);
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [changeEmail]);

  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        <h2>User Edit Screen</h2>
        Current Username: {user.username}
        {toggleUsername ? (
          <form onSubmit={handleSubmitUsername}>
            <label htmlFor="changeUsername">
              Change Username:
              <input
                type="text"
                name="changeUsername"
                value={changeUsername}
                onChange={(event) => handleUsernameInput(event)}
              />
            </label>
            {usernameAvailable
              ? "✔️ Username Available"
              : "❌ Username Not Available"}
            <button>Save Username</button>
            <button onClick={handleUsernameCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setToggleUsername(true)}>Change Username</div>
        )}
        <br />
        {togglePassword ? (
          <form onSubmit={handleSubmitPassword}>
            <label htmlFor="changePassword">
              Change Password:
              <input
                type="text"
                name="changePassword"
                value={changePassword}
                onChange={(event) => setChangePassword(event.target.value)}
              />
            </label>
            <button>Save Password</button>
            <button onClick={handlePasswordCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setTogglePassword(true)}>Change Password</div>
        )}
        <br />
        Current Email: {user.email}
        {toggleEmail ? (
          <form onSubmit={handleSubmitEmail}>
            <label htmlFor="changeEmail">
              Change Email:
              <input
                type="text"
                name="changeEmail"
                value={changeEmail}
                onChange={(event) => handleEmailInput(event)}
              />
            </label>
            {emailAvailable ? "✔️" : "❌"}
            <button>Save Email</button>
            <button onClick={handleEmailCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setToggleEmail(true)}>Change Email</div>
        )}
        <br />
        <button onClick={() => setToggleEditUser(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserEdit;
