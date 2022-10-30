import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LogOutButton from "../../LogOutButton/LogOutButton";

// Import local image
const image = require("../../../images/organization-station-background.png");

function CreateOrganization() {
  // Setup redux variables
  const dispatch = useDispatch();
  const types = useSelector((store) => store.organization.orgTypes);

  // Setup local state for input
  const [orgName, setOrgName] = useState("");

  // Setup router variables
  const history = useHistory();

  function handleCreateOrganization(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to create organization to DB and set user to admin
    dispatch({
      type: "CREATE_ORGANIZATION",
      payload: {
        name: orgName,
        type_id: orgType.value,
      },
    });
    // Send user to selection page
    history.replace("/choose");
  }

  // Begin useEffect to fetch to available types of organizations
  useEffect(() => {
    dispatch({ type: "FETCH_TYPES" });
  }, []); // End fetch types

  return (
    <main
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        height: `100vh`,
        width: `100vw`,
      }}
      className="bg-image vw-100 d-flex flex-column justify-content-center align-items-center"
    >
      <div className="os__bg px-4 bg-light w-50 h-50 py-3 rounded-4 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center text-primary">Create Organization</h2>
        <Form onSubmit={handleCreateOrganization}>
          <Form.Group>
            <Form.Label className="w-100">
              Organization Name:
              <Form.Control
                type="text"
                name="orgName"
                value={orgName}
                required
                onChange={(event) => setOrgName(event.target.value)}
              />
            </Form.Label>
            <Form.Select name="orgType" id="orgType">
              <option value="1">Organization Type</option>
              {types?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
            <div className="w-100 d-flex justify-content-center mt-1">
              <Button type="submit" variant="primary">
                Create
              </Button>
              <Button
                className="ms-1"
                variant="secondary"
                type="button"
                onClick={() => history.replace("/choose")}
              >
                Cancel
              </Button>
            </div>
          </Form.Group>
        </Form>
      </div>
    </main>
  ); // End return
} // End CreateOrganization

export default CreateOrganization;
