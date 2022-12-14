import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.sandstone.min.css";
import "./App.css";

import UserPage from "../Pages/UserPage/UserPage";
import LandingPage from "../Pages/LandingPage/LandingPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";

import ChoosePage from "../Pages/ChoosePage/ChoosePage";
import ResourcePage from "../Pages/ResourcePage/ResourcePage";
import SchedulePage from "../Pages/SchedulePage/SchedulePage";
import ChatPage from "../Pages/ChatPage/ChatPage";
import CreateOrganization from "../Pages/CreateOrganization/CreateOrganization";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/home" />

          <ProtectedRoute exact path="/choose">
            <ChoosePage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/create">
            <CreateOrganization />
          </ProtectedRoute>

          <ProtectedRoute exact path="/resources/:orgid">
            <ResourcePage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/schedule/:orgid">
            <SchedulePage />
          </ProtectedRoute>

          <ProtectedRoute exact path="/chat/:orgid">
            <ChatPage />
          </ProtectedRoute>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <ProtectedRoute exact path="/user/:orgid?">
            {/* logged in shows UserPage else shows LoginPage */}
            <UserPage />
          </ProtectedRoute>

          <Route exact path="/login">
            {/* If the user is already logged in, redirect to the /user page */}
            {/* Otherwise, show the login page */}
            {user.id ? <Redirect to="/choose" /> : <LoginPage />}
          </Route>

          {/* If the user is already logged in, redirect them to the /user page */}
          {/* Otherwise, show the registration page */}
          <Route exact path="/registration">
            {user.id ? <Redirect to="/choose" /> : <RegisterPage />}
          </Route>

          {/* If the user is already logged in, redirect them to the /user page */}
          {/* Otherwise, show the Landing page */}
          <Route exact path="/home">
            {user.id ? <Redirect to="/choose" /> : <LandingPage />}
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
