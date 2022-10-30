import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function UserOrgTypeChange({ setToggleOrganizationType, organization }) {
  // Setup redux variables
  const dispatch = useDispatch();
  const orgTypes = useSelector((store) => store.organization.orgTypes);

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

  return (
    <Form onSubmit={handleOrgTypeSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="changeOrgType">Change Type:</Form.Label>
        <Form.Select name="changeOrgType" id="changeOrgType">
          {orgTypes.map((type, index) => (
            <option key={index} value={type.id}>
              {type.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button className="mb-3" variant="primary" type="submit">
          Save
        </Button>
        <Button
          className="ms-1 mb-3"
          onClick={() => setToggleOrganizationType(false)}
          variant="secondary"
          type="button"
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default UserOrgTypeChange;
