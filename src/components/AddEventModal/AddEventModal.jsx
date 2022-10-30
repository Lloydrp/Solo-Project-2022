import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AddEventModal({ setToggleModal, toggleModal, orgid }) {
  const dispatch = useDispatch();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState();

  function handleAddEvent(event) {
    event.preventDefault();

    dispatch({
      type: "ADD_EVENT",
      payload: {
        event_name: eventName,
        event_description: eventDescription,
        start_event: eventDate,
        organization_id: orgid,
      },
    });

    setToggleModal(false);
  }

  return (
    <Modal show={toggleModal} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Add event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="addEvent" onSubmit={handleAddEvent}>
          <Form.Group>
            <Form.Label>Event Name:</Form.Label>
            <Form.Control
              type="text"
              name="eventName"
              value={eventName}
              required
              onChange={(event) => setEventName(event.target.value)}
              autoComplete="off"
            />
            <Form.Label>Event Date:</Form.Label>
            <Form.Control
              type="date"
              name="eventDate"
              value={eventDate}
              required
              onChange={(event) => setEventDate(event.target.value)}
            />
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              name="eventDescription"
              value={eventDescription}
              onChange={(event) => setEventDescription(event.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEvent" variant="primary">
          Add
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

export default AddEventModal;
