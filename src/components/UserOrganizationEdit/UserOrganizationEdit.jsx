import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import UserOrgNameChange from "../UserOrgNameChange/UserOrgNameChange";
import UserOrgTypeChange from "../UserOrgTypeChange/UserOrgTypeChange";
import UserOrgAddTitle from "../UserOrgAddTitle/UserOrgAddTitle";
import UserOrgRemoveTitle from "../UserOrgRemoveTitle/UserOrgRemoveTitle";
import UserOrgAddUser from "../UserOrgAddUser/UserOrgAddUser";
import UserOrgAdminStatus from "../UserOrgAdminStatus/UserOrgerAdminStatus";

function UserOrganizationEdit({ organization, setToggleEditOrganization }) {
  // Setup redux variables
  const dispatch = useDispatch();
  const orgTypes = useSelector((store) => store.organization.orgTypes);
  const orgTitles = useSelector((store) => store.organization.orgTitles);
  const unsortedOrgUsers = useSelector((store) => store.organization.orgUsers);
  // Sorting users by admin
  const orgUsers = unsortedOrgUsers.sort((userOne, userTwo) =>
    userOne.is_admin === userTwo.is_admin ? 0 : userOne.is_admin ? -1 : 1
  );
  // Setup local state for inputs, toggles, and available booleans
  const [toggleOrganizationName, setToggleOrganizationName] = useState(false);
  const [toggleOrganizationType, setToggleOrganizationType] = useState(false);
  const [toggleAddTitle, setToggleAddTitle] = useState(false);
  const [toggleRemoveTitle, setToggleRemoveTitle] = useState(false);
  const [toggleShowUsers, setToggleShowUsers] = useState(false);

  // Begin function to remove user from organization
  function handleRemoveFromOrg(id) {
    // Dispatch to saga to remove user from organization
    dispatch({
      type: "REMOVE_FROM_ORG",
      payload: {
        user_id: id,
        organization_id: organization.organization_id,
      },
    });
  } // End handleRemoveFromOrg

  return (
    <>
      <Card body className="w-100" onClick={(event) => event.stopPropagation()}>
        {/* Begin change organization name area */}
        <div className="d-flex flex-column align-items-center">
          Current Name: {organization.organization_name}
          {toggleOrganizationName ? (
            <UserOrgNameChange
              setToggleOrganizationName={setToggleOrganizationName}
            />
          ) : (
            <button
              className="btn btn-info mb-3"
              onClick={() => setToggleOrganizationName(true)}
            >
              Change Organization Name
            </button>
          )}
        </div>

        {/* Begin change organization type area */}
        <div className="d-flex flex-column align-items-center">
          Current Type:{" "}
          {
            orgTypes[
              orgTypes.findIndex(
                (type) => type.id === organization.organization_type_id
              )
            ].name
          }
          {toggleOrganizationType ? (
            <UserOrgTypeChange
              setToggleOrganizationType={setToggleOrganizationType}
            />
          ) : (
            <div
              className="btn btn-info mb-3"
              onClick={() => setToggleOrganizationType(true)}
            >
              Change Organization Type
            </div>
          )}
        </div>

        {/* Begin adding organization title area */}
        <div className="d-flex flex-column align-items-center">
          {toggleAddTitle ? (
            <UserOrgAddTitle setToggleAddTitle={setToggleAddTitle} />
          ) : (
            <div
              className="btn btn-info mb-3"
              onClick={() => setToggleAddTitle(true)}
            >
              Add Organization Title
            </div>
          )}
        </div>

        {/* Begin removing organization title area */}
        <div className="d-flex flex-column align-items-center">
          {toggleRemoveTitle ? (
            <UserOrgRemoveTitle
              orgTitles={orgTitles}
              setToggleRemoveTitle={setToggleRemoveTitle}
            />
          ) : (
            <div
              className="btn btn-info mb-3"
              onClick={() => setToggleRemoveTitle(true)}
            >
              Remove Organization Title
            </div>
          )}
        </div>

        <div className="d-flex flex-column flex-lg-row justify-content-around">
          <div className="d-flex flex-column align-items-center">
            {/* Begin adding user to organization area */}
            <span>Add User to Organization:</span>
            <UserOrgAddUser orgTitles={orgTitles} />
          </div>
          <div className="d-flex flex-column align-items-center">
            {/* Begin adding/removing admin status area */}
            <span>Change Admin Status:</span>
            <UserOrgAdminStatus />
          </div>
        </div>

        {/* Begin Organization user list area */}
        <div className="d-flex flex-column align-items-center">
          <h5>Organization users:</h5>
          {toggleShowUsers ? (
            <>
              {orgUsers.map((user, index) => (
                <li key={index}>
                  {user.first_name} {user.last_name} {user.username}
                  {user.title
                    ? orgTitles[
                        orgTitles.findIndex((title) => title.id === user.title)
                      ]?.title_name
                    : "No Title"}
                  {user.is_admin ? "Admin" : ""}
                  <button onClick={() => handleRemoveFromOrg(user.user_id)}>
                    Remove
                  </button>
                </li>
              ))}
              <button
                className="btn btn-info mt-1"
                onClick={() => setToggleShowUsers(false)}
              >
                Hide users
              </button>
            </>
          ) : (
            <button
              className="btn btn-info mb-3"
              onClick={() => setToggleShowUsers(true)}
            >
              Show all users
            </button>
          )}
        </div>

        <div className="d-flex flex-column align-items-center">
          <button
            type="button"
            className="mt-3 btn btn-outline-secondary"
            onClick={() => setToggleEditOrganization(false)}
          >
            Back to Profile
          </button>
        </div>
      </Card>
    </>
  );
}

export default UserOrganizationEdit;
