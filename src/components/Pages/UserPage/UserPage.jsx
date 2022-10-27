import React, { useEffect, useState } from "react";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import UserEdit from "../../UserEdit/UserEdit";
import UserOrganizationEdit from "../../UserOrganizationEdit/UserOrganizationEdit";
import Card from "react-bootstrap/Card";

function UserPage() {
  // Setup redux variables
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // Setup router variables
  const params = useParams();
  const history = useHistory();

  // Setup local state for toggles
  const [toggleEditUser, setToggleEditUser] = useState(false);
  const [toggleEditOrganization, setToggleEditOrganization] = useState(false);

  // Setup specific organization variable
  const organization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );

  // Begin useEffect for initial page load
  useEffect(() => {
    // Check if user has a user_account with current organization
    // if they do not, send them to choose screen.  This avoids
    // manual adjustment of organization id via params
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    // Dispatches to fetch the types, titles, and users attached to organization on load
    dispatch({ type: "FETCH_TYPES" });
    dispatch({
      type: "FETCH_TITLES",
      payload: {
        organization_id: organization.organization_id,
      },
    });
    dispatch({
      type: "FETCH_ORG_USERS",
      payload: { id: organization.organization_id },
    });
  }, []); // End useEffect

  return (
    <>
      <NavbarComponent orgid={params.orgid} />
      <main>
        <h2 className="text-primary text-center mt-3">
          Welcome, {user.username}!
        </h2>
        <section className="d-flex flex-wrap vw-100 justify-content-center">
          <div
            className="w-75 d-flex align-items-center"
            onClick={() => setToggleEditUser(true)}
          >
            {/* Conditional Render user edit page or button to access user edit page */}
            {toggleEditUser ? (
              <UserEdit setToggleEditUser={setToggleEditUser} />
            ) : (
              !toggleEditOrganization && (
                <button className="os__min_h mt-3 w-100 btn btn-outline-primary text-center">
                  Edit User Information
                </button>
              )
            )}
          </div>
          <div
            onClick={() => setToggleEditOrganization(true)}
            className="w-75 d-flex align-items-center"
          >
            {/* Conditional Render organization edit page if admin or button to access organization edit page */}
            {organization.is_admin && toggleEditOrganization ? (
              <UserOrganizationEdit
                organization={organization}
                setToggleEditOrganization={setToggleEditOrganization}
              />
            ) : (
              organization.is_admin &&
              !toggleEditUser && (
                <button className="os__min_h mt-3 w-100 btn btn-outline-primary text-center">
                  Edit Organization Information
                </button>
              )
            )}
          </div>
        </section>
        <div className="vw-100 d-flex flex-wrap justify-content-center">
          <button
            className="btn btn-primary w-75 text-center mt-3"
            onClick={() => history.push("/choose")}
          >
            Change Organization
          </button>
          <LogOutButton className="mt-3 btn btn-outline-secondary w-75" />
        </div>
      </main>
    </>
  ); // End return
} // End UserPage

export default UserPage;
