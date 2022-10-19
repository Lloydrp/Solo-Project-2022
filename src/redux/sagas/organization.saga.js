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

function* fetchTypes(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(`/api/organization/types`, config);

    yield put({ type: "SET_TYPES", payload: results.data });
  } catch (error) {
    console.log("error caught in fetchTypes :>> ", error);
  }
}

function* createOrg(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.post("/api/organization", action.payload, config);
    yield put({ type: "FETCH_USER" });
  } catch (error) {
    console.log("error caught in createOrg :>> ", error);
  }
}

function* addResource(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.post("/api/organization/addresource", action.payload, config);
    yield put({
      type: "FETCH_ORGANIZATION",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in addResource :>> ", error);
  }
}

function* addEvent(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.post("/api/organization/addevent", action.payload, config);
    yield put({
      type: "FETCH_ORGANIZATION",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in addEvent :>> ", error);
  }
}

function* updateEvent(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/organization/events", action.payload, config);
    yield put({
      type: "FETCH_ORGANIZATION",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in updateEvent :>> ", error);
  }
}

function* fetchParticipants(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(
      `/api/organization/participants/${action.payload.id}`,
      config
    );

    yield put({ type: "SET_PARTICIPANTS", payload: results.data });
  } catch (error) {
    console.log("error caught in fetchParticipants :>> ", error);
  }
}

function* organizationSaga() {
  yield takeEvery("FETCH_ORGANIZATION", fetchOrganization);
  yield takeEvery("FETCH_ORG_USERS", fetchOrgUsers);
  yield takeEvery("CREATE_ORGANIZATION", createOrg);
  yield takeEvery("FETCH_TYPES", fetchTypes);
  yield takeEvery("ADD_RESOURCE", addResource);
  yield takeEvery("ADD_EVENT", addEvent);
  yield takeEvery("UPDATE_EVENT", updateEvent);
  yield takeEvery("FETCH_PARTICIPANTS", fetchParticipants);
}

export default organizationSaga;
