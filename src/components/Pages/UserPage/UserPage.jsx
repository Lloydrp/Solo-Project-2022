import React, { useEffect } from "react";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import Nav from "../../Nav/Nav";
import { useHistory, useParams } from "react-router-dom";

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();

  const organization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );

  console.log("user :>> ", user);
  console.log("organization :>> ", organization.is_admin);

  console.log(
    user.organization_array.find(
      (item) => item.organization_id === params.orgid
    )
  );

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
        <p>Your ID is: {user.id}</p>
        <section className="org-container">
          <div>Edit User Info</div>
          {organization.is_admin && <div>Edit Organization</div>}
        </section>
        <LogOutButton className="btn" />
      </main>
    </>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
