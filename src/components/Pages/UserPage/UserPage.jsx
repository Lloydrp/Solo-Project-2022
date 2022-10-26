import React, { useEffect, useState } from "react";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import { useHistory, useParams } from "react-router-dom";
import UserEdit from "../../UserEdit/UserEdit";
import UserOrganizationEdit from "../../UserOrganizationEdit/UserOrganizationEdit";
import { useDispatch } from "react-redux";

function UserPage() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const [toggleEditUser, setToggleEditUser] = useState(false);
  const [toggleEditOrganization, setToggleEditOrganization] = useState(false);

  const organization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );
  console.log("organization :>> ", organization);

  function handleChangeOrganization() {
    history.push("/choose");
  }

  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

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
  }, []);

  return (
    <>
      <NavbarComponent className="navLink" orgid={params.orgid} />
      <main className="container">
        <h2>Welcome, {user.username}!</h2>
        <section className="org-container">
          <div onClick={() => setToggleEditUser(true)}>
            {toggleEditUser ? (
              <UserEdit setToggleEditUser={setToggleEditUser} />
            ) : (
              !toggleEditOrganization && "Edit User Information"
            )}
          </div>
          <div onClick={() => setToggleEditOrganization(true)}>
            {organization.is_admin && toggleEditOrganization ? (
              <UserOrganizationEdit
                organization={organization}
                setToggleEditOrganization={setToggleEditOrganization}
              />
            ) : (
              organization.is_admin &&
              !toggleEditUser &&
              "Edit Organization Information"
            )}
          </div>
        </section>
        <button onClick={handleChangeOrganization}>Change Organization</button>
        <LogOutButton className="btn" />
      </main>
    </>
  );
}

export default UserPage;
