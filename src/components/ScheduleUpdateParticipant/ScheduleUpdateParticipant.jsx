import { useState } from "react";
import { useDispatch } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

function ScheduleUpdateParticipant({ eventParticipant, orgid, eventItem }) {
  const dispatch = useDispatch();
  const [newDuty, setNewDuty] = useState(eventParticipant.ep_event_duty);

  function handleDeleteParticipant(id) {
    dispatch({
      type: "DELETE_EVENT_PARTICIPANT",
      payload: {
        organization_id: orgid,
        event_id: eventItem.id,
        user_id: id,
      },
    });
  }

  function handleUpdateParticipant(id) {
    dispatch({
      type: "UPDATE_PARTICIPANT",
      payload: {
        organization_id: orgid,
        event_id: eventItem.id,
        user_id: id,
        event_duty: newDuty,
      },
    });
  }

  return (
    <ListGroup.Item>
      <span>{`${eventParticipant.first_name} ${eventParticipant.last_name}
      (${
        eventParticipant.title_name ? eventParticipant.title_name : "No Title"
      })`}</span>
      <Form>
        <Form.Group>
          <Form.Control
            className={
              newDuty === eventParticipant.ep_event_duty
                ? "is-valid"
                : "is-invalid"
            }
            placeholder="Participant Duty"
            type="text"
            name="newDuty"
            value={newDuty}
            onChange={(event) => setNewDuty(event.target.value)}
          />
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={() => handleUpdateParticipant(eventParticipant.ep_user_id)}
          >
            Update
          </button>
          <button
            className="btn btn-sm btn-danger ms-1 mt-1"
            type="button"
            onClick={() => handleDeleteParticipant(eventParticipant.ep_user_id)}
          >
            Remove
          </button>
        </Form.Group>
      </Form>
      {/*
      {
        <input

        />
      }
      {newDuty === eventParticipant.ep_event_duty ? "✔️" : "❌"}
       */}
    </ListGroup.Item>
  );
}

export default ScheduleUpdateParticipant;
