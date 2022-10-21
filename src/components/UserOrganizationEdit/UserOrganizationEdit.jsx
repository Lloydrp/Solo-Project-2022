import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function UserOrganizationEdit({ organization, setToggleEditOrganization }) {
  const dispatch = useDispatch();
  const orgTypes = useSelector((store) => store.organization.orgTypes);
  const orgTitles = useSelector((store) => store.organization.orgTitles);
  const unsortedOrgUsers = useSelector((store) => store.organization.orgUsers);
  const orgUsers = unsortedOrgUsers.sort((userOne, userTwo) =>
    userOne.is_admin === userTwo.is_admin ? 0 : userOne.is_admin ? -1 : 1
  );
  const [changeOrganizationName, setChangeOrganizationName] = useState("");
  const [addNewUser, setAddNewUser] = useState("");
  const [addAdminStatus, setAddAdminStatus] = useState("");
  const [toggleOrganizationName, setToggleOrganizationName] = useState(false);
  const [toggleOrganizationType, setToggleOrganizationType] = useState(false);
  const [orgNameAvailable, setOrgNameAvailable] = useState(false);

  function handleOrgNameSubmit(event) {
    event.preventDefault();

    dispatch({
      type: "CHANGE_ORGANIZATION_NAME",
      payload: {
        newName: changeOrganizationName,
        organization_id: organization.organization_id,
      },
    });

    setChangeOrganizationName("");
  }

  function handleOrgTypeSubmit(event) {
    event.preventDefault();

    dispatch({
      type: "CHANGE_ORGANIZATION_TYPE",
      payload: {
        newType: changeOrgType.value,
        organization_id: organization.organization_id,
      },
    });
  }

  function handleOrganizationNameInput(event) {
    setChangeOrganizationName(event.target.value);
    setOrgNameAvailable(false);
  }

  function handleOrgNameCancel(event) {
    event.preventDefault();
    setToggleOrganizationName(false);
  }

  function handleOrgTypeCancel(event) {
    event.preventDefault();
    setToggleOrganizationType(false);
  }

  function handleAddUser(event) {
    event.preventDefault();

    dispatch({
      type: "ADD_TO_ORGANIZATION",
      payload: {
        newUser: addNewUser,
        title_id: addNewTitle.value === "null" ? null : addNewTitle.value,
        organization_id: organization.organization_id,
      },
    });
  }

  function handleAddAdmin(event) {
    event.preventDefault();

    console.log({
      newAdmin: addAdminStatus,
      organization_id: organization.organization_id,
    });

    if (event.nativeEvent.submitter.value === "add") {
    } else if (event.nativeEvent.submitter.value === "remove") {
    } else {
      console.log("Error in add/remove admin submission");
    }
  }

  useEffect(() => {
    if (changeOrganizationName) {
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/api/organization/checkorgname/${changeOrganizationName}`)
          .then((result) => {
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
  }, [changeOrganizationName]);

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
              {user.first_name} {user.last_name}{" "}
              {user.title ? user.title : "No Title"}{" "}
              {user.is_admin ? "Admin" : ""}
              <button>Remove</button>
            </li>
          ))}
        </div>
        <button onClick={() => setToggleEditOrganization(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserOrganizationEdit;
