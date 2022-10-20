import { useDispatch } from "react-redux";

function ScheduleUpdateParticipant({ eventParticipant, orgid, eventItem }) {
  const dispatch = useDispatch();

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
    console.log();
  }

  return (
    <li>
      {eventParticipant.first_name} {eventParticipant.last_name}(
      {eventParticipant.title_name}){eventParticipant.ep_event_duty}
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
