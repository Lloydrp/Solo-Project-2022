import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function UserOrgAddTitle({ setToggleAddTitle }) {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state variables
  const [addTitle, setAddTitle] = useState("");

  // Begin function to handle title add to DB
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

  return (
    <Form onSubmit={handleAddTitle}>
      <Form.Group className="mb-3" controlId="addTitle">
        <Form.Control
          name="addTitle"
          value={addTitle}
          onChange={(event) => setAddTitle(event.target.value)}
          type="text"
          placeholder="Enter new title"
        />
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button className="mb-3" variant="primary" type="submit">
          Add Title
        </Button>
        <Button
          onClick={() => setToggleAddTitle(false)}
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

export default UserOrgAddTitle;
