import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ScheduleUpdateParticipant from "../ScheduleUpdateParticipant/ScheduleUpdateParticipant";

function ScheduleCard({ eventItem, orgid }) {
  const dispatch = useDispatch();
  const participants = useSelector(
    (store) => store.organization.eventParticipants
  );
  const [toggleEdit, setToggleEdit] = useState(false);
  const [eventName, setEventName] = useState(eventItem.event_name);
  const [eventDescription, setEventDescription] = useState(
    eventItem.event_description || ""
  );
  const [eventDate, setEventDate] = useState(eventItem.start_event);
  const [addParticipant, setAddParticipant] = useState("");
  const [newDuty, setNewDuty] = useState("");

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

  function handleDeleteEvent(id) {
    dispatch({
      type: "DELETE_EVENT",
      payload: {
        id: id,
        organization_id: orgid,
      },
    });
  }

  function handleAddParticipant() {
    dispatch({
      type: "ADD_EVENT_PARTICIPANT",
      payload: {
        organization_id: orgid,
        event_id: eventItem.id,
        username: addParticipant,
        event_duty: newDuty,
      },
    });
    setAddParticipant("");
    setNewDuty("");
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
          placeholder="Username to add"
          type="text"
          name="addParticipant"
          value={addParticipant}
          onChange={(event) => setAddParticipant(event.target.value)}
        />
        <input
          placeholder="Participant Duty"
          type="text"
          name="newDuty"
          value={newDuty}
          onChange={(event) => setNewDuty(event.target.value)}
        />
        <button type="button" onClick={handleAddParticipant}>
          Add Participant
        </button>
        {participants?.map(
          (eventParticipants) =>
            Number(eventParticipants.event_id) === Number(eventItem.id) &&
            eventParticipants.participant_info.map(
              (eventParticipant, index) =>
                Number(eventParticipants.event_id) === Number(eventItem.id) && (
                  <ScheduleUpdateParticipant
                    eventItem={eventItem}
                    orgid={orgid}
                    key={index}
                    eventParticipant={eventParticipant}
                  />
                )
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
          (eventParticipants) =>
            Number(eventParticipants.event_id) === Number(eventItem.id) &&
            eventParticipants.participant_info.map(
              (eventParticipant, index) => (
                <li key={index}>
                  {eventParticipant.first_name} {eventParticipant.last_name}(
                  {eventParticipant.title_name}){eventParticipant.ep_event_duty}
                </li>
              )
            )
        )}
        <button onClick={() => setToggleEdit(true)}>Edit</button>
        <button onClick={() => handleDeleteEvent(eventItem.id)}>Delete</button>
      </div>
    );
  }
}

export default ScheduleCard;
