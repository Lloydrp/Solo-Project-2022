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

    console.log("object :>> ", results.data);

    yield put({ type: "SET_ORG", payload: results.data });
  } catch (error) {
    console.log("Error with fetch org:", error);
  }
}

function* organizationSaga() {
  yield takeEvery("FETCH_ORGANIZATION", fetchOrganization);
}

export default organizationSaga;
