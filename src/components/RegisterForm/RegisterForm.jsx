import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function RegisterForm() {
  // Setup local state for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);

  // Setup redux variables
  const dispatch = useDispatch();

  // Begin function to handle registration
  function handleRegistration(event) {
    // Prevent form refresh
    event.preventDefault();

    // Dispatch to create user in DB
    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      },
    });
  } // end handleRegistration

  // Begin useEffect to check if username is currently available
  useEffect(() => {
    if (username) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkusername/${username}`)
          .then((result) => {
            // If result is blank then username is available
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
  }, [username]); // End useEffect for username availability

  // Begin useEffect to check if email is currently in use
  useEffect(() => {
    if (email) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/user/checkemail/${email}`)
          .then((result) => {
            // If result is blank then email is not in use
            result.data.length === 0
              ? setEmailAvailable(true)
              : setEmailAvailable(false);
          })
          .catch((error) => {
            console.log("error caught in check email :>> ", error);
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [email]); // End useEffect for email in use

  return (
    <main>
      <h2 className="text-center text-primary my-3">Register</h2>
      <Form
        onSubmit={handleRegistration}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <Form.Group className="d-flex flex-column mb-3">
          <Form.Label className="text-primary">Username</Form.Label>
          <Form.Control
            // If username available and not blank then mark valid
            className={
              usernameAvailable && usernameAvailable !== ""
                ? "is-valid mb-3"
                : "is-invalid mb-3"
            }
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            autoComplete="off"
          />
          <Form.Label className="text-primary">First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Enter first name"
            className="mb-3"
            autoComplete="off"
          />
          <Form.Label className="text-primary">Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter last name"
            className="mb-3"
            autoComplete="off"
          />
          <Form.Label className="text-primary">Email</Form.Label>
          <Form.Control
            // If email is available and not blank than mark valid
            className={
              emailAvailable && emailAvailable !== ""
                ? "is-valid mb-3"
                : "is-invalid mb-3"
            }
            type="text"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
            autoComplete="off"
          />
          <Form.Label className="text-primary">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter Password"
            className="mb-3"
            autoComplete="off"
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </main>
  ); // End return
} // End RegisterForm

export default RegisterForm;
