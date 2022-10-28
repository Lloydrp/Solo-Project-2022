import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AddResourceModal({ toggleModal, setToggleModal, orgid }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [resourceName, setResourceName] = useState("");
  const [resourceURL, setResourceURL] = useState("");

  // Begin function to handle adding resource
  function handleAddResource(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to add to DB
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
    // Disable modal
    setToggleModal(false);
  } // End handleAddResource

  return (
    <Modal show={toggleModal} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Add Resource</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addResource" onSubmit={handleAddResource}>
          <Form.Group>
            <Form.Label>Resource Name:</Form.Label>
            <Form.Control
              type="text"
              name="resourceName"
              value={resourceName}
              required
              onChange={(event) => setResourceName(event.target.value)}
            />
            <Form.Label>Resource URL:</Form.Label>
            <Form.Control
              type="text"
              name="resourceURL"
              value={resourceURL}
              required
              onChange={(event) => setResourceURL(event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addResource" variant="primary">
          Add Resource
        </Button>
        <Button
          type="button"
          onClick={() => setToggleModal(false)}
          variant="secondary"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddResourceModal;
