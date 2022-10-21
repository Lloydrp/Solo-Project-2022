import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function UserOrganizationEdit({ organization, setToggleEditOrganization }) {
  const dispatch = useDispatch();
  const orgTypes = useSelector((store) => store.organization.orgTypes);
  const orgTitles = useSelector((store) => store.organization.orgTitles);
  const [changeOrganizationName, setChangeOrganizationName] = useState("");
  const [addNewUser, setAddNewUser] = useState("");
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
    //POST TO DB
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
              <option value={""}>Choose Title</option>
              {orgTitles.map((type, index) => (
                <option key={index} value={type.id}>
                  {type.title_name}
                </option>
              ))}
            </select>
          </label>
          <button>Add</button>
        </form>
        <button onClick={() => setToggleEditOrganization(false)}>Cancel</button>
      </div>
    </>
  );
}

export default UserOrganizationEdit;
