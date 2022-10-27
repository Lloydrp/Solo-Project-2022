import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

function UserOrgNameChange({ setToggleOrganizationName }) {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state for inputs, toggles, etc.
  const [changeOrganizationName, setChangeOrganizationName] = useState("");
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

  // Begin function to handle organization name input and reset availability to false
  function handleOrganizationNameInput(event) {
    setChangeOrganizationName(event.target.value);
    setOrgNameAvailable(false);
  } // End handleOrganizationNameInput

  // Begin function to handle organization name cancel
  function handleOrgNameCancel(event) {
    setToggleOrganizationName(false);
    setChangeOrganizationName("");
  } // End handleOrgNameCancel

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
    <Form onSubmit={handleOrgNameSubmit}>
      <Form.Group className="mb-3" controlId="changeOrganizationName">
        <Form.Control
          // If username is available show valid input
          className={orgNameAvailable ? "is-valid" : "is-invalid"}
          name="changeOrganizationName"
          value={changeOrganizationName}
          onChange={(event) => handleOrganizationNameInput(event)}
          type="text"
          placeholder="Enter new name"
        />
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button className="mb-3" variant="primary" type="submit">
          Save
        </Button>
        <Button
          onClick={handleOrgNameCancel}
          className="ms-1 mb-3"
          variant="secondary"
          type="button"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default UserOrgNameChange;
