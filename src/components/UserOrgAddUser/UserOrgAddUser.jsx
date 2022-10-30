import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function UserOrgAddUser({ orgTitles, organization }) {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state variables
  const [addNewUser, setAddNewUser] = useState("");

  // Begin function to handle user addition
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

  return (
    <Form onSubmit={handleAddUser}>
      <Form.Group className="mb-3" controlId="addNewUser">
        <Form.Control
          name="addNewUser"
          value={addNewUser}
          onChange={(event) => setAddNewUser(event.target.value)}
          type="text"
          placeholder="Username"
          autoComplete="off"
        />
        <Form.Select name="addNewTitle" id="addNewTitle">
          <option value={"null"}>Select title</option>
          {orgTitles.map((type, index) => (
            <option key={index} value={type.id}>
              {type.title_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button className="mb-3 shadow" variant="primary" type="submit">
          Add User
        </Button>
      </div>
    </Form>
  );
}

export default UserOrgAddUser;
