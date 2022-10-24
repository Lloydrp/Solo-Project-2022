import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function CreateOrganization() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [orgName, setOrgName] = useState("");
  const types = useSelector((store) => store.organization.orgTypes);

  function handleCreateOrganization(event) {
    event.preventDefault();

    dispatch({
      type: "CREATE_ORGANIZATION",
      payload: {
        name: orgName,
        type_id: orgType.value,
      },
    });
    history.replace("/choose");
  }

  useEffect(() => {
    dispatch({ type: "FETCH_TYPES" });
  }, []);

  return (
    <main>
      <form className="formPanel" onSubmit={handleCreateOrganization}>
        <h2>Create Organization</h2>
        <label htmlFor="orgName">
          Organization Name:
          <input
            type="text"
            name="orgName"
            value={orgName}
            required
            onChange={(event) => setOrgName(event.target.value)}
          />
        </label>
        <select name="orgType" id="orgType">
          <option value="">Choose a type of Organization</option>
          {types?.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <br />
        <button>Create</button>
        <button type="button" onClick={() => history.replace("/choose")}>
          Cancel
        </button>
      </form>
    </main>
  );
}

export default CreateOrganization;
