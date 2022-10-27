import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function UserUpdatePassForm({ setTogglePassword }) {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state to handle input
  const [changePassword, setChangePassword] = useState("");

  // Begin function to handle cancel and reset toggle
  function handlePasswordCancel(event) {
    event.preventDefault();
    setTogglePassword(false);
    setChangePassword("");
  } // End handlePasswordCancel

  // Begin function to update password
  function handleSubmitPassword(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch saga to change password to DB
    dispatch({
      type: "CHANGE_PASSWORD",
      payload: {
        newPassword: changePassword,
      },
    });
    // Clear input
    setChangePassword("");
  } // End handleSubmitPassword

  return (
    <Form onSubmit={handleSubmitPassword}>
      <Form.Group className="mb-3" controlId="changePassword">
        <Form.Control
          autoComplete="off"
          type="text"
          name="changePassword"
          value={changePassword}
          onChange={(event) => setChangePassword(event.target.value)}
          placeholder="Enter new password"
        />
      </Form.Group>

      <Button className="mb-3" variant="primary" type="submit">
        Save Password
      </Button>
      <Button
        onClick={handlePasswordCancel}
        className="ms-1 mb-3"
        variant="secondary"
        type="button"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UserUpdatePassForm;
