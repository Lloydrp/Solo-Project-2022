import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import UserOrgNameChange from "../UserOrgNameChange/UserOrgNameChange";
import UserOrgTypeChange from "../UserOrgTypeChange/UserOrgTypeChange";
import UserOrgAddTitle from "../UserOrgAddTitle/UserOrgAddTitle";
import UserOrgRemoveTitle from "../UserOrgRemoveTitle/UserOrgRemoveTitle";
import UserOrgAddUser from "../UserOrgAddUser/UserOrgAddUser";
import UserOrgAdminStatus from "../UserOrgAdminStatus/UserOrgerAdminStatus";
import UserOrgShowUsers from "../UserOrgShowUsers/UserOrgShowUsers";

function UserOrganizationEdit({ organization, setToggleEditOrganization }) {
  // Setup redux variables
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

  return (
    <section className="d-flex flex-column w-100">
      <Card className="w-100 p-0 shadow">
        <h2 className="text-center border-bottom">Edit Organization Info</h2>

        {/* Begin change organization name area */}
        <div className="d-flex flex-column align-items-center border-bottom w-100">
          Current Name: {organization.organization_name}
          {toggleOrganizationName ? (
            <UserOrgNameChange
              organization={organization}
              setToggleOrganizationName={setToggleOrganizationName}
            />
          ) : (
            <button
              className="btn btn-sm btn-info shadow mb-3"
              onClick={() => setToggleOrganizationName(true)}
            >
              Change Organization Name
            </button>
          )}
        </div>

        {/* Begin change organization type area */}
        <div className="d-flex flex-column align-items-center border-bottom w-100 mt-3">
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
              organization={organization}
              setToggleOrganizationType={setToggleOrganizationType}
            />
          ) : (
            <div
              className="btn btn-sm btn-info shadow mb-3"
              onClick={() => setToggleOrganizationType(true)}
            >
              Change Organization Type
            </div>
          )}
        </div>

        {/* Begin adding organization title area */}
        <div className="d-flex flex-column align-items-center border-bottom w-100 mt-3">
          {toggleAddTitle ? (
            <UserOrgAddTitle
              organization={organization}
              setToggleAddTitle={setToggleAddTitle}
            />
          ) : (
            <div
              className="btn btn-sm btn-info shadow mb-3"
              onClick={() => setToggleAddTitle(true)}
            >
              Add Organization Title
            </div>
          )}
        </div>

        {/* Begin removing organization title area */}
        <div className="d-flex flex-column align-items-center border-bottom w-100 mt-3">
          {toggleRemoveTitle ? (
            <UserOrgRemoveTitle
              organization={organization}
              orgTitles={orgTitles}
              setToggleRemoveTitle={setToggleRemoveTitle}
            />
          ) : (
            <div
              className="btn btn-sm btn-info shadow mb-3"
              onClick={() => setToggleRemoveTitle(true)}
            >
              Remove Organization Title
            </div>
          )}
        </div>

        <div className="d-flex flex-column flex-lg-row justify-content-around border-bottom w-100 mt-3">
          <div className="d-flex flex-column align-items-center">
            {/* Begin adding user to organization area */}
            <span>Add User to Organization:</span>
            <UserOrgAddUser organization={organization} orgTitles={orgTitles} />
          </div>
          <div className="d-flex flex-column align-items-center">
            {/* Begin adding/removing admin status area */}
            <span>Change Admin Status:</span>
            <UserOrgAdminStatus organization={organization} />
          </div>
        </div>

        {/* Begin Organization user list area */}
        <div className="d-flex flex-column align-items-center">
          <span className="mt-3">Organization users:</span>
          {toggleShowUsers ? (
            <UserOrgShowUsers
              orgTitles={orgTitles}
              orgUsers={orgUsers}
              setToggleShowUsers={setToggleShowUsers}
              organization={organization}
            />
          ) : (
            <button
              className="btn btn-sm btn-info shadow mb-3"
              onClick={() => setToggleShowUsers(true)}
            >
              Show all users
            </button>
          )}
        </div>
      </Card>

      <div
        className="d-flex flex-column align-items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="mt-3 mb-3 btn btn-outline-secondary shadow"
          onClick={() => setToggleEditOrganization(false)}
        >
          Back to Profile
        </button>
      </div>
    </section>
  );
}

export default UserOrganizationEdit;
