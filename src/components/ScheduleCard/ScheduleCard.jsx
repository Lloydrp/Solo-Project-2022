import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function ScheduleCard({ eventItem, orgid }) {
  const dispatch = useDispatch();
  const participants = useSelector(
    (store) => store.organization.eventParticipants
  );
  const [toggleEdit, setToggleEdit] = useState(false);
  const [eventName, setEventName] = useState(eventItem.event_name);
  const [eventDescription, setEventDescription] = useState(
    eventItem.event_description
  );
  const [eventDate, setEventDate] = useState(eventItem.start_event);
  const [addParticipant, setAddParticipant] = useState("");

  function handleEdit(event) {
    event.preventDefault();

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

    setToggleEdit(false);
  }

  function handleDelete(id) {
    dispatch({
      type: "DELETE_EVENT",
      payload: {
        id: id,
        organization_id: orgid,
      },
    });
  }

  if (toggleEdit) {
    return (
      <form onSubmit={handleEdit}>
        <input
          type="text"
          name="eventName"
          value={eventName}
          required
          onChange={(event) => setEventName(event.target.value)}
        />
        <input
          type="date"
          name="eventDate"
          value={eventDate}
          required
          onChange={(event) => setEventDate(event.target.value)}
        />
        <br />
        <textarea
          type="text"
          name="eventDescription"
          value={eventDescription}
          onChange={(event) => setEventDescription(event.target.value)}
        />
        <br />
        <input
          type="text"
          name="addParticipant"
          value={addParticipant}
          onChange={(event) => setAddParticipant(event.target.value)}
        />
        <button>Add Participant</button>
        {participants?.map(
          (item, index) =>
            Number(item.event_id) === Number(eventItem.id) && (
              <li key={index}>
                {item.participant_info[0].first_name}{" "}
                {item.participant_info[0].last_name}(
                {item.participant_info[0].title_name})
                {item.participant_info[0].ep_event_duty}
                <button>Update</button>
                <button>Delete</button>
              </li>
            )
        )}
        <button type="submit">Update Event</button>
        <button type="button" onClick={() => setToggleEdit(false)}>
          Cancel
        </button>
      </form>
    );
  } else {
    return (
      <div>
        {`${eventItem.event_name} ${eventItem.event_description} ${eventItem.start_event}`}
        <br />
        {participants?.map(
          (item, index) =>
            Number(item.event_id) === Number(eventItem.id) && (
              <li key={index}>
                {item.participant_info[0].first_name}{" "}
                {item.participant_info[0].last_name}(
                {item.participant_info[0].title_name})
                {item.participant_info[0].ep_event_duty}
              </li>
            )
        )}
        <button onClick={() => setToggleEdit(true)}>Edit</button>
        <button onClick={() => handleDelete(eventItem.id)}>Delete</button>
      </div>
    );
  }
}

export default ScheduleCard;
