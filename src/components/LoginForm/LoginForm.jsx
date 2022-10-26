import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LoginForm() {
  // Setup local state for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Setup redux variables
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  // Setup router variables
  const history = useHistory();

  function handleLogin(event) {
    // Prevent form refresh
    event.preventDefault();

    // Data validation for an entered username and password
    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
      history.push("/choose");
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  } // End handleLogin

  return (
    <main>
      <h2 className="text-center">Login</h2>
      <Form
        onSubmit={handleLogin}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <Form.Group className="mb-3" controlId="formLoginUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLoginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter Password"
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </main>
  ); // End return
} // End LoginForm

export default LoginForm;
