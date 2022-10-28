import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ScheduleUpdateParticipant from "../ScheduleUpdateParticipant/ScheduleUpdateParticipant";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

function CardEdit({ setToggleEdit, eventItem, orgid }) {
  // Setup redux variables
  const dispatch = useDispatch();
  const participants = useSelector(
    (store) => store.organization.eventParticipants
  );
  // Setup local state with some defaults
  const [eventName, setEventName] = useState(eventItem.event_name);
  const [eventDescription, setEventDescription] = useState(
    eventItem.event_description || ""
  );
  const [eventDate, setEventDate] = useState(eventItem.start_event);
  const [addParticipant, setAddParticipant] = useState("");
  const [newDuty, setNewDuty] = useState("");

  // Begin function to handle edit submission
  function handleEdit(event) {
    // Prevent form refresh
    event.preventDefault();
    // Dispatch to saga to update the current event
    dispatch({
      type: "UPDATE_EVENT",
      payload: {
        id: eventItem.id,
        event_name: eventName,
        event_description: eventDescription,
        start_event: eventDate,
        organization_id: orgid,
      },
    });
    // Reset Toggle
    setToggleEdit(false);
  } // End handleEdit

  // Begin function to handle adding a participant to event
  function handleAddParticipant() {
    // Dispatch to saga to add event participant
    dispatch({
      type: "ADD_EVENT_PARTICIPANT",
      payload: {
        organization_id: orgid,
        event_id: eventItem.id,
        username: addParticipant,
        event_duty: newDuty,
      },
    });
    // Clear participant info
    setAddParticipant("");
    setNewDuty("");
  } // End handleAddParticipant

  return (
    <Card className="os__shadow col-11 col-lg-3 mx-auto mx-lg-1 mb-3 text-white bg-primary text-center">
      <Form onSubmit={handleEdit}>
        <Form.Group className="px-1 pt-1">
          <Form.Control
            type="text"
            name="eventName"
            value={eventName}
            required
            onChange={(event) => setEventName(event.target.value)}
          />
          <Form.Control
            type="date"
            name="eventDate"
            value={eventDate}
            required
            onChange={(event) => setEventDate(event.target.value)}
          />
          <Form.Control
            as="textarea"
            placeholder="Enter description"
            type="text"
            name="eventDescription"
            value={eventDescription}
            onChange={(event) => setEventDescription(event.target.value)}
          />
        </Form.Group>
        <button className="btn btn-sm btn-light mt-1 mb-3" type="submit">
          Update Event
        </button>
        <Form.Group className="px-1">
          <Form.Control
            placeholder="Username to add"
            type="text"
            name="addParticipant"
            value={addParticipant}
            onChange={(event) => setAddParticipant(event.target.value)}
          />
          <Form.Control
            placeholder="Participant duty"
            type="text"
            name="newDuty"
            value={newDuty}
            onChange={(event) => setNewDuty(event.target.value)}
          />
          <button
            className="btn btn-sm btn-light mt-1 mb-3"
            type="button"
            onClick={handleAddParticipant}
          >
            Add Participant
          </button>
        </Form.Group>
      </Form>
      <ListGroup className="list-group-flush">
        {Number(participants[0]?.event_id) === Number(eventItem.id) &&
          participants[0].participant_info.map(
            (eventParticipant, index) =>
              Number(participants[0].event_id) === Number(eventItem.id) && (
                <ScheduleUpdateParticipant
                  eventItem={eventItem}
                  orgid={orgid}
                  key={index}
                  eventParticipant={eventParticipant}
                />
              )
          )}
      </ListGroup>
      <button
        className="btn btn-sm btn-info"
        type="button"
        onClick={() => setToggleEdit(false)}
      >
        Done
      </button>
    </Card>
  );
}

export default CardEdit;
