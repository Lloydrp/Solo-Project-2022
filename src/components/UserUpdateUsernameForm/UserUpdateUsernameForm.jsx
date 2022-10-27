import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

function UserUpdateUsernameForm({ setToggleUsername }) {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state for inputs, and availability tracker
  const [changeUsername, setChangeUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  // Begin function to update username
  function handleSubmitUsername(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch saga to change username to DB
    dispatch({
      type: "CHANGE_USERNAME",
      payload: {
        newUsername: changeUsername,
      },
    });
    // Clear input
    setChangeUsername("");
  } // End handleSubmitUsername

  // Begin function to handle inputs and reset availability to false
  function handleUsernameInput(event) {
    setChangeUsername(event.target.value);
    setUsernameAvailable(false);
  } // End handleUsernameInput

  // Begin function set to handle canceling changes
  function handleUsernameCancel(event) {
    event.preventDefault();
    setToggleUsername(false);
    setChangeUsername("");
  } // End handleUsernameCancel

  // Begin useEffect to check username availability
  useEffect(() => {
    if (changeUsername) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkusername/${changeUsername}`)
          .then((result) => {
            // If data is empty username is available
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
  }, [changeUsername]); // End username availability

  return (
    <Form onSubmit={handleSubmitUsername}>
      <Form.Group className="mb-3" controlId="changeUsername">
        <Form.Control
          // If username is available show valid input
          className={usernameAvailable ? "is-valid" : "is-invalid"}
          name="changeUsername"
          value={changeUsername}
          onChange={(event) => handleUsernameInput(event)}
          type="text"
          placeholder="Enter new username"
        />
      </Form.Group>

      <Button className="mb-3" variant="primary" type="submit">
        Save Username
      </Button>
      <Button
        onClick={handleUsernameCancel}
        className="ms-1 mb-3"
        variant="secondary"
        type="button"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UserUpdateUsernameForm;
