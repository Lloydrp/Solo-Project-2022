import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

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
  const [changeOrganizationName, setChangeOrganizationName] = useState("");
  const [addNewUser, setAddNewUser] = useState("");
  const [addAdminStatus, setAddAdminStatus] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [toggleOrganizationName, setToggleOrganizationName] = useState(false);
  const [toggleOrganizationType, setToggleOrganizationType] = useState(false);
  const [toggleAddTitle, setToggleAddTitle] = useState(false);
  const [toggleRemoveTitle, setToggleRemoveTitle] = useState(false);
  const [orgNameAvailable, setOrgNameAvailable] = useState(false);

  // Begin function to handle name change submit
  function handleOrgNameSubmit(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to change organization name
    dispatch({
      type: "CHANGE_ORGANIZATION_NAME",
      payload: {
        newName: changeOrganizationName,
        organization_id: organization.organization_id,
      },
    });
    // Clear organization state
    setChangeOrganizationName("");
  } // End handleOrgNameSubmit

  // Begin function to handle organization type change
  function handleOrgTypeSubmit(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to change organization type
    dispatch({
      type: "CHANGE_ORGANIZATION_TYPE",
      payload: {
        newType: changeOrgType.value,
        organization_id: organization.organization_id,
      },
    });
  } // End handleOrgTypeSubmit

  // Begin function to handle organization name input and reset availability to false
  function handleOrganizationNameInput(event) {
    setChangeOrganizationName(event.target.value);
    setOrgNameAvailable(false);
  } // End handleOrganizationNameInput

  function handleOrgNameCancel(event) {
    event.preventDefault();
    setToggleOrganizationName(false);
  } // End handleOrgNameCancel

  function handleOrgTypeCancel(event) {
    event.preventDefault();
    setToggleOrganizationType(false);
  } // End handleOrgTypeCancel

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

  function handleAddTitleCancel(event) {
    event.preventDefault();
    setToggleAddTitle(false);
  } // End handleAddTitleCancel

  function handleAddTitle(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to add a new title to organization
    dispatch({
      type: "ADD_TITLE",
      payload: {
        organization_id: organization.organization_id,
        newTitle: addTitle,
      },
    });
    // Clear add title state and reset toggle to off
    setAddTitle("");
    setToggleAddTitle(false);
  } // End handleAddTitle

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

  // Begin useEffect to check if organization name is in use
  useEffect(() => {
    // If there is an organization name in the input, check if it's available after a 500 millisecond delay for typing
    if (changeOrganizationName) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/organization/checkorgname/${changeOrganizationName}`)
          .then((result) => {
            // If data is empty then organization name is available
            result.data.length === 0
              ? setOrgNameAvailable(true)
              : setOrgNameAvailable(false);
          })
          .catch((error) => {
            console.log("error caught in check org name :>> ", error);
          });
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [changeOrganizationName]); // End useEffect for organization availability

  return (
    <>
      <div onClick={(event) => event.stopPropagation()}>
        Current Organization Name: {organization.organization_name}
        {toggleOrganizationName ? (
          <form onSubmit={handleOrgNameSubmit}>
            <label htmlFor="changeOrganizationName">
              Change Organization Name:
              <input
                type="text"
                name="changeOrganizationName"
                value={changeOrganizationName}
                onChange={(event) => handleOrganizationNameInput(event)}
              />
            </label>
            {orgNameAvailable
              ? "✔️ Organization Name Available"
              : "❌ Organization Name Not Available"}
            <button>Save</button>
            <button onClick={handleOrgNameCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setToggleOrganizationName(true)}>
            Change Organization Name
          </div>
        )}
        Current Organization Type:{" "}
        {
          orgTypes[
            orgTypes.findIndex(
              (type) => type.id === organization.organization_type_id
            )
          ].name
        }
        {toggleOrganizationType ? (
          <form onSubmit={handleOrgTypeSubmit}>
            <label htmlFor="changeOrgType">
              Change Organization Type:
              <select name="changeOrgType" id="changeOrgType">
                <option value={organization.organization_type_id}>
                  Choose Organization Type
                </option>
                {orgTypes.map((type, index) => (
                  <option key={index} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
            <button>Save</button>
            <button onClick={handleOrgTypeCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setToggleOrganizationType(true)}>
            Change Organization Type
          </div>
        )}
        {toggleAddTitle ? (
          <form onSubmit={(event) => handleAddTitle(event)}>
            <label htmlFor="addTitle">
              Add Title:
              <input
                type="text"
                name="addTitle"
                value={addTitle}
                onChange={(event) => setAddTitle(event.target.value)}
              />
            </label>
            <button>Save</button>
            <button onClick={handleAddTitleCancel}>Cancel</button>
          </form>
        ) : (
          <div onClick={() => setToggleAddTitle(true)}>
            Add Organization Title
          </div>
        )}
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
          <div onClick={() => setToggleRemoveTitle(true)}>
            Remove Organization Title
          </div>
        )}
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
        <div>
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
        <button onClick={() => setToggleEditOrganization(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserOrganizationEdit;
