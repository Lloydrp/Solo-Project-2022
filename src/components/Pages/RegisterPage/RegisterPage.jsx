import React from "react";
import { useHistory } from "react-router-dom";
import RegisterForm from "../../RegisterForm/RegisterForm";

// Import local image
const image = require("../../../images/organization-station-background.png");

function RegisterPage() {
  //Setup router variables
  const history = useHistory();

  return (
    <main
      className="bg-image d-flex flex-column align-items-center vh-100 justify-content-center"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        height: `100vh`,
        width: `100vw`,
      }}
    >
      <div className="os__bg bg-light w-50 h-auto py-3 rounded-4 d-flex flex-column justify-content-center align-items-center">
        <RegisterForm />

        <center>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </button>
        </center>
      </div>
    </main>
  ); // End return
} // End RegisterPage

export default RegisterPage;
