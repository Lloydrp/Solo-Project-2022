import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";

function* fetchMessages(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(`/api/messages/${action.payload.organization_id}`, config);
    yield put({ type: "SET_MESSAGES", payload: results.data });
  } catch (error) {
    console.log("Error with user registration:", error);
  }
}

function* messagesSaga() {
  yield takeLatest("FETCH_MESSAGES", fetchMessages);
}

export default messagesSaga;
