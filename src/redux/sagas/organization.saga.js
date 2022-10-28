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

function* fetchTitles(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.get(
      `/api/organization/titles/${action.payload.organization_id}`,
      config
    );

    yield put({ type: "SET_TITLES", payload: results.data });
  } catch (error) {
    console.log("error caught in fetchTitles:>> ", error);
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

function* deleteEvent(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.delete(
      `/api/organization/deleteevent/${action.payload.organization_id}/${action.payload.id}`,
      config
    );
    yield put({
      type: "FETCH_ORGANIZATION",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in deleteEvent :>> ", error);
  }
}

function* deleteEventParticipant(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.delete(
      `/api/organization/deleteparticipant/${action.payload.organization_id}/${action.payload.event_id}/${action.payload.user_id}`,
      config
    );
    yield put({
      type: "FETCH_PARTICIPANTS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in deleteEventParticipant :>> ", error);
  }
}

function* addEventParticipant(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const results = yield axios.post(
      "/api/organization/addparticipant",
      action.payload,
      config
    );
    
    if (results.data[0]?.id) {
      yield put({
        type: "FETCH_PARTICIPANTS",
        payload: { id: action.payload.organization_id },
      });
    } else {
      alert("User already a participant!");
    }
  } catch (error) {
    alert(
      "Error adding participant. Please verify the user is a part of the organization."
    );
    console.log("error caught in addEventParticipant :>> ", error);
  }
}

function* updateParticipant(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put(
      "/api/organization/updateparticipant",
      action.payload,
      config
    );
    yield put({
      type: "FETCH_PARTICIPANTS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in updateParticipant :>> ", error);
  }
}

function* changeOrganizationName(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/organization/changeorgname", action.payload, config);
    yield put({
      type: "FETCH_USER",
    });
  } catch (error) {
    console.log("error caught in changeOrganizationName :>> ", error);
  }
}

function* changeOrganizationType(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/organization/changeorgtype", action.payload, config);
    yield put({
      type: "FETCH_USER",
    });
  } catch (error) {
    console.log("error caught in changeOrganizationType :>> ", error);
  }
}

function* addToOrganization(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.post("/api/organization/addtoorg", action.payload, config);
    yield put({
      type: "FETCH_ORG_USERS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in addToOrg :>> ", error);
  }
}

function* addAdminStatus(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/organization/addadmin", action.payload, config);
    yield put({
      type: "FETCH_ORG_USERS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in updateAdmin :>> ", error);
  }
}

function* removeAdminStatus(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.put("/api/organization/removeadmin", action.payload, config);
    yield put({
      type: "FETCH_ORG_USERS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in removeAdmin :>> ", error);
  }
}

function* removeFromOrg(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.delete(
      `/api/organization/removeuser/${action.payload.organization_id}/${action.payload.user_id}`,
      config
    );
    yield put({
      type: "FETCH_ORG_USERS",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in removeUser :>> ", error);
  }
}

function* removeTitle(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.delete(
      `/api/organization/removetitle/${action.payload.organization_id}/${action.payload.title_id}`,
      config
    );
    yield put({
      type: "FETCH_TITLES",
      payload: { organization_id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in removeTitle :>> ", error);
  }
}

function* addTitle(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.post(`/api/organization/addtitle`, action.payload, config);
    yield put({
      type: "FETCH_TITLES",
      payload: { organization_id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in addTitle :>> ", error);
  }
}

function* deleteResource(action) {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    yield axios.delete(
      `/api/organization/deleteresource/${action.payload.organization_id}/${action.payload.id}`,
      config
    );
    yield put({
      type: "FETCH_ORGANIZATION",
      payload: { id: action.payload.organization_id },
    });
  } catch (error) {
    console.log("error caught in deleteResource :>> ", error);
  }
}

function* organizationSaga() {
  yield takeEvery("FETCH_ORGANIZATION", fetchOrganization);
  yield takeEvery("FETCH_ORG_USERS", fetchOrgUsers);
  yield takeEvery("CREATE_ORGANIZATION", createOrg);
  yield takeEvery("FETCH_TYPES", fetchTypes);
  yield takeEvery("FETCH_TITLES", fetchTitles);
  yield takeEvery("ADD_RESOURCE", addResource);
  yield takeEvery("ADD_EVENT", addEvent);
  yield takeEvery("UPDATE_EVENT", updateEvent);
  yield takeEvery("FETCH_PARTICIPANTS", fetchParticipants);
  yield takeEvery("DELETE_EVENT", deleteEvent);
  yield takeEvery("DELETE_EVENT_PARTICIPANT", deleteEventParticipant);
  yield takeEvery("ADD_EVENT_PARTICIPANT", addEventParticipant);
  yield takeEvery("UPDATE_PARTICIPANT", updateParticipant);
  yield takeEvery("CHANGE_ORGANIZATION_NAME", changeOrganizationName);
  yield takeEvery("CHANGE_ORGANIZATION_TYPE", changeOrganizationType);
  yield takeEvery("ADD_TO_ORGANIZATION", addToOrganization);
  yield takeEvery("ADD_ADMIN_STATUS", addAdminStatus);
  yield takeEvery("REMOVE_ADMIN_STATUS", removeAdminStatus);
  yield takeEvery("REMOVE_FROM_ORG", removeFromOrg);
  yield takeEvery("REMOVE_TITLE", removeTitle);
  yield takeEvery("ADD_TITLE", addTitle);
  yield takeEvery("DELETE_RESOURCE", deleteResource);
}

export default organizationSaga;
