import { put, takeEvery } from "redux-saga/effects";
import axios from "axios";

function* fetchOrganization(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(
      `/api/user/choose/${action.payload.id}`,
      config
    );

    yield put({ type: "SET_ORG", payload: results.data });
  } catch (error) {
    console.log("Error with fetch org:", error);
  }
}

function* fetchOrgUsers(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(
      `/api/user/choose/users/${action.payload.id}`,
      config
    );

    yield put({ type: "SET_ORG_USERS", payload: results.data });
  } catch (error) {
    console.log("error caught in fetchOrgUsers :>> ", error);
  }
}

function* organizationSaga() {
  yield takeEvery("FETCH_ORGANIZATION", fetchOrganization);
  yield takeEvery("FETCH_ORG_USERS", fetchOrgUsers);
}

export default organizationSaga;
