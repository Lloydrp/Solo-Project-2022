import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LoginForm() {
  // Setup local state for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Setup redux variables
  const dispatch = useDispatch();

  // Setup router variables
  const history = useHistory();

  // Begin function to handle login
  function handleLogin(event) {
    // Prevent form refresh
    event.preventDefault();

    // Dispatch to login user
    dispatch({
      type: "LOGIN",
      payload: {
        username: username,
        password: password,
      },
    });

    history.push("/choose");
  } // End handleLogin

  return (
    <main>
      <h2 className="text-center text-primary mb-3">Login</h2>
      <Form
        onSubmit={handleLogin}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <Form.Group className="mb-3">
          <Form.Label className="text-primary">Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            className="mb-3"
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
            autoComplete="off"
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </main>
  ); // End return
} // End LoginForm

export default LoginForm;
