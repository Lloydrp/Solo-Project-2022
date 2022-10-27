import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function UserOrgAdminStatus() {
  // Setup redux variables
  const dispatch = useDispatch();
  // Setup local state variables
  const [addAdminStatus, setAddAdminStatus] = useState("");

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

  return (
    <Form onSubmit={handleAddAdmin}>
      <Form.Group className="mb-3" controlId="addAdminStatus">
        <Form.Control
          name="addAdminStatus"
          value={addAdminStatus}
          onChange={(event) => setAddAdminStatus(event.target.value)}
          type="text"
          placeholder="Username"
        />
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button
          value="add"
          name="addAdmin"
          className="mb-3"
          variant="primary"
          type="submit"
        >
          Add
        </Button>
        <Button
          value="remove"
          name="removeAdmin"
          className="ms-1 mb-3"
          variant="danger"
          type="submit"
        >
          Remove
        </Button>
      </div>
    </Form>
  );
}

export default UserOrgAdminStatus;
