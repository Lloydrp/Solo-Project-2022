import axios from "axios";
import { put, takeEvery, takeLatest } from "redux-saga/effects";

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get("/api/user", config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: "SET_USER", payload: response.data });
  } catch (error) {
    console.log("User get request failed", error);
  }
}

function* changeUsername(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/user/changeusername", action.payload, config);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.log("error caught in changeUsername :>> ", error);
  }
}

function* changePassword(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/user/changepassword", action.payload, config);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.log("error caught in changePassword :>> ", error);
  }
}

function* changeEmail(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/user/changeemail", action.payload, config);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.log("error caught in changeEmail :>> ", error);
  }
}

function* userSaga() {
  yield takeLatest("FETCH_USER", fetchUser);
  yield takeEvery("CHANGE_USERNAME", changeUsername);
  yield takeEvery("CHANGE_PASSWORD", changePassword);
  yield takeEvery("CHANGE_EMAIL", changeEmail);
}

export default userSaga;
