import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function AddResourceModal({ setToggleModal, orgid }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [resourceName, setResourceName] = useState("");
  const [resourceURL, setResourceURL] = useState("");

  function handleAddResource(event) {
    event.preventDefault();

    dispatch({
      type: "ADD_RESOURCE",
      payload: {
        file_name: resourceName,
        file_url: resourceURL,
        type_id: 0,
        organization_id: orgid,
        user_id: user.id,
      },
    });

    setToggleModal(false);
  }

  return (
    <div className="modal-background" onClick={() => setToggleModal(false)}>
      <div
        className="modal-wrapper"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Resource</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleAddResource}>
            <label htmlFor="resourceName">
              Resource Name:
              <input
                type="text"
                name="resourceName"
                value={resourceName}
                required
                onChange={(event) => setResourceName(event.target.value)}
              />
            </label>
            <label htmlFor="resourceURL">
              Resource URL:
              <input
                type="text"
                name="resourceURL"
                value={resourceURL}
                required
                onChange={(event) => setResourceURL(event.target.value)}
              />
            </label>
            <br />
            <button type="submit">Add Resource</button>
            <button type="button" onClick={() => setToggleModal(false)}>
              Cancel
            </button>
          </form>
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
}

export default AddResourceModal;
