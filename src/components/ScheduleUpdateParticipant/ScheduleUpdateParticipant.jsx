import { useState } from "react";
import { useDispatch } from "react-redux";

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
    <li>
      {eventParticipant.first_name} {eventParticipant.last_name}(
      {eventParticipant.title_name})
      {
        <input
          placeholder="Participant Duty"
          type="text"
          name="newDuty"
          value={newDuty}
          onChange={(event) => setNewDuty(event.target.value)}
        />
      }
      {newDuty === eventParticipant.ep_event_duty ? "✔️" : "❌"}
      <button
        type="button"
        onClick={() => handleUpdateParticipant(eventParticipant.ep_user_id)}
      >
        Update
      </button>
      <button
        type="button"
        onClick={() => handleDeleteParticipant(eventParticipant.ep_user_id)}
      >
        Delete
      </button>
    </li>
  );
}

export default ScheduleUpdateParticipant;
