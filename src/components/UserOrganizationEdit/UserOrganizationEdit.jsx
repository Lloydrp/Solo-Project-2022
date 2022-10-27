import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import UserOrgNameChange from "../UserOrgNameChange/UserOrgNameChange";
import UserOrgTypeChange from "../UserOrgTypeChange/UserOrgTypeChange";
import UserOrgAddTitle from "../UserOrgAddTitle/UserOrgAddTitle";

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
  const [addNewUser, setAddNewUser] = useState("");
  const [addAdminStatus, setAddAdminStatus] = useState("");
  const [toggleOrganizationName, setToggleOrganizationName] = useState(false);
  const [toggleOrganizationType, setToggleOrganizationType] = useState(false);
  const [toggleAddTitle, setToggleAddTitle] = useState(false);
  const [toggleRemoveTitle, setToggleRemoveTitle] = useState(false);

  function handleAddUser(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to add new user
    dispatch({
      type: "ADD_TO_ORGANIZATION",
      payload: {
        newUser: addNewUser,
        // If title is null send null otherwise send selected title
        title_id: addNewTitle.value === "null" ? null : addNewTitle.value,
        organization_id: organization.organization_id,
      },
    });
    // Clear add user state
    setAddNewUser("");
  } // End handleAddUser

  function handleAddAdmin(event) {
    // Prevent form refresh
    event.preventDefault();
    // Check if the Add or Remove admin button was clicked if add, add user to admin status
    if (event.nativeEvent.submitter.value === "add") {
      // Dispatch to saga to add admin status
      dispatch({
        type: "ADD_ADMIN_STATUS",
        payload: {
          newAdmin: addAdminStatus,
          organization_id: organization.organization_id,
        },
      });
      // Clear admin status state
      setAddAdminStatus("");
      // If not add then remove the user from admin status
    } else if (event.nativeEvent.submitter.value === "remove") {
      // Dispatch to saga to remove admin status
      dispatch({
        type: "REMOVE_ADMIN_STATUS",
        payload: {
          newAdmin: addAdminStatus,
          organization_id: organization.organization_id,
        },
      });
      // Clear admin status state
      setAddAdminStatus("");
    } else {
      console.log("Error in add/remove admin submission");
    }
  } // End handleAddAdmin

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

  // Begin function to remove a title from organization
  function handleRemoveTitle(id) {
    // Dispatch to saga to remove title from organization
    dispatch({
      type: "REMOVE_TITLE",
      payload: {
        organization_id: organization.organization_id,
        title_id: id,
      },
    });
  } // End handleRemoveTitle

  return (
    <>
      <Card body className="w-100" onClick={(event) => event.stopPropagation()}>
        {/* Begin change organization name area */}
        <div className="d-flex flex-column align-items-center">
          Current Organization Name: {organization.organization_name}
          {toggleOrganizationName ? (
            <UserOrgNameChange
              setToggleOrganizationName={setToggleOrganizationName}
            />
          ) : (
            <button
              className="btn btn-primary mb-3"
              onClick={() => setToggleOrganizationName(true)}
            >
              Change Organization Name
            </button>
          )}
        </div>

        {/* Begin change organization type area */}
        <div className="d-flex flex-column align-items-center">
          Current Organization Type:{" "}
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
              className="btn btn-primary mb-3"
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
              className="btn btn-primary mb-3"
              onClick={() => setToggleAddTitle(true)}
            >
              Add Organization Title
            </div>
          )}
        </div>

        {/* Begin removing organization title area */}
        <div className="d-flex flex-column align-items-center">
          {toggleRemoveTitle ? (
            <>
              <ul>
                {orgTitles.map((title, index) => (
                  <li key={index}>
                    {title.title_name}
                    <button onClick={() => handleRemoveTitle(title.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setToggleRemoveTitle(false)}>
                Done
              </button>
            </>
          ) : (
            <div
              className="btn btn-primary mb-3"
              onClick={() => setToggleRemoveTitle(true)}
            >
              Remove Organization Title
            </div>
          )}
        </div>

        {/* Begin adding user to organization area */}
        <div className="d-flex flex-column align-items-center">
          Add User to Organization:
          <form onSubmit={(event) => handleAddUser(event)}>
            <label htmlFor="addNewUser">
              Username to Add:
              <input
                type="text"
                name="addNewUser"
                value={addNewUser}
                onChange={(event) => setAddNewUser(event.target.value)}
              />
            </label>
            <label htmlFor="addNewTitle">
              Add User Title:
              <select name="addNewTitle" id="addNewTitle">
                <option value="null">Choose Title</option>
                {orgTitles.map((type, index) => (
                  <option key={index} value={type.id}>
                    {type.title_name}
                  </option>
                ))}
              </select>
            </label>
            <button>Add</button>
          </form>
        </div>

        {/* Begin adding/removing admin status area */}
        <div className="d-flex flex-column align-items-center">
          <form onSubmit={(event) => handleAddAdmin(event)}>
            <label htmlFor="addAdminStatus">
              Admin Access:
              <input
                placeholder="Enter username"
                type="text"
                name="addAdminStatus"
                value={addAdminStatus}
                onChange={(event) => setAddAdminStatus(event.target.value)}
              />
            </label>
            <button value="add" name="addAdmin">
              Add
            </button>
            <button value="remove" name="removeAdmin">
              Remove
            </button>
          </form>
        </div>

        {/* Begin Organization user list area */}
        <div className="d-flex flex-column align-items-center">
          <p>Organization users:</p>
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
        </div>

        <div className="d-flex flex-column align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary"
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
