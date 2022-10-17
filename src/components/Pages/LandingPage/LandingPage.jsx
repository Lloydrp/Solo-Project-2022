import React from "react";
import { useHistory } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const history = useHistory();

  function getStartHandler() {
    history.push("/registration");
  }
  return (
    <main className="landing-page">
      <h1>Organization Station</h1>
      <button onClick={getStartHandler}>Get Started</button>
      <br />
      <a href="/#/login">Already a user? Login</a>
    </main>
  );
}

export default LandingPage;
