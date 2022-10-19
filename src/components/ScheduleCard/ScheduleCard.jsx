import { useState } from "react";
import { useDispatch } from "react-redux";

function ScheduleCard({ item, orgid }) {
  const dispatch = useDispatch();
  const [toggleEdit, setToggleEdit] = useState(false);
  const [eventName, setEventName] = useState(item.event_name);
  const [eventDescription, setEventDescription] = useState(
    item.event_description
  );
  const [eventDate, setEventDate] = useState(item.start_event);

  function handleEdit(event) {
    event.preventDefault();

    dispatch({
      type: "UPDATE_EVENT",
      payload: {
        id: item.id,
        event_name: eventName,
        event_description: eventDescription,
        start_event: eventDate,
        organization_id: orgid,
      },
    });

    setToggleEdit(false);
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
        <button type="submit">Update Event</button>
        <button type="button" onClick={() => setToggleEdit(false)}>
          Cancel
        </button>
      </form>
    );
  } else {
    return (
      <div>
        {`${item.event_name} ${item.event_description} ${item.start_event}`}
        <br />
        <button onClick={() => setToggleEdit(true)}>Edit</button>
      </div>
    );
  }
}

export default ScheduleCard;
