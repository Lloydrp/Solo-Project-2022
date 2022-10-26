import React from "react";
import LoginForm from "../../LoginForm/LoginForm";
import { useHistory } from "react-router-dom";

// Import local image
const image = require("../../../images/organization-station-background.png");

function LoginPage() {
  //Setup router variables
  const history = useHistory();

  return (
    <main
      className="bg-image d-flex flex-column align-items-center vh-100 justify-content-center"
      style={{
        backgroundImage: `url(${image})`,
        height: `100vh`,
        width: `100vw`,
      }}
    >
      <div className="bg-light w-50 h-50 rounded-4 d-flex flex-column justify-content-center align-items-center">
        <LoginForm />

        <center>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              history.push("/registration");
            }}
          >
            Register
          </button>
        </center>
      </div>
    </main>
  ); // End return
} // End LoginPage

export default LoginPage;
