import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

function UserEmailUpdateForm({ setToggleEmail }) {
  // Setup router variables
  const dispatch = useDispatch();

  // Setup local state to check availability
  const [changeEmail, setChangeEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);

  // Begin function to handle email input
  function handleEmailInput(event) {
    setChangeEmail(event.target.value);
    setEmailAvailable(false);
  } // End handleEmailInput

  // Begin function to handle email cancel
  function handleEmailCancel(event) {
    event.preventDefault();
    setToggleEmail(false);
    setChangeEmail("");
  } // End handleEmailCancel

  // Begin function to update email
  function handleSubmitEmail(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch saga to change email to DB
    dispatch({
      type: "CHANGE_EMAIL",
      payload: {
        newEmail: changeEmail,
      },
    });
    // Clear input
    setChangeEmail("");
  } // End handleSubmitEmail
  axios;
  // Begin useEffect to check email availability
  useEffect(() => {
    if (changeEmail) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkemail/${changeEmail}`)
          .then((result) => {
            // If data is empty email is available
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
  }, [changeEmail]); // End email availability

  return (
    <Form
      onSubmit={handleSubmitEmail}
      className="d-flex flex-column align-items-center flex-lg-row justify-content-lg-center"
    >
      <Form.Group className="mb-3" controlId="changeEmail">
        <Form.Control
          // If email is valid use valid class from CSS
          className={emailAvailable ? "is-valid" : "is-invalid"}
          type="text"
          name="changeEmail"
          value={changeEmail}
          onChange={(event) => handleEmailInput(event)}
          placeholder="New email"
          autoComplete="off"
        />
      </Form.Group>

      <Button
        className="mb-1 mb-lg-3 ms-lg-1 shadow"
        variant="primary"
        type="submit"
      >
        Save Username
      </Button>
      <Button
        onClick={handleEmailCancel}
        className="ms-1 mb-3 shadow"
        variant="secondary"
        type="button"
      >
        Cancel
      </Button>
    </Form>
  );
}

export default UserEmailUpdateForm;
