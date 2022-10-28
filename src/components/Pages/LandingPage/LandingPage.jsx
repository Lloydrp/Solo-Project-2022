import React from "react";
import { useHistory } from "react-router-dom";

// Import local image
const image = require("../../../images/organization-station-background.png");

function LandingPage() {
  // Setup router variables
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
      <div className="os__bg p-4 bg-light w-75 h-50 rounded-4 d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-center text-primary mb-3 fw-bold fs-1 ">
          Organization Station
        </h1>
        <p className="text-center text-dark">
          A place to park all your trains of thought
        </p>
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => {
            history.push("/registration");
          }}
        >
          Get Started
        </button>
        <a className="text-secondary" href="/#/login">
          Already a user? Login
        </a>
      </div>
    </main>
  ); // End return
} // End LandingPage

export default LandingPage;
