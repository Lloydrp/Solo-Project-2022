import React, { useEffect, useState } from "react";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import Nav from "../../Nav/Nav";
import { useHistory, useParams } from "react-router-dom";
import UserEdit from "../../UserEdit/UserEdit";
import UserOrganizationEdit from "../../UserOrganizationEdit/UserOrganizationEdit";

function UserPage() {
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const [toggleEditUser, setToggleEditUser] = useState(false);
  const [toggleEditOrganization, setToggleEditOrganization] = useState(false);

  const organization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );

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
  }, []);

  return (
    <>
      <Nav className="navLink" orgid={params.orgid} />
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
                orgid={params.orgid}
                setToggleEditOrganization={setToggleEditOrganization}
              />
            ) : (
              !toggleEditUser && "Edit Organization Information"
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
