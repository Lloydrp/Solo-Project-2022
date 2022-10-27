import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CardNonEdit from "../CardNonEdit/CardNonEdit";
import ScheduleUpdateParticipant from "../ScheduleUpdateParticipant/ScheduleUpdateParticipant";

function ScheduleCard({ eventItem, orgid }) {
  // Setup redux variables
  const dispatch = useDispatch();
  const participants = useSelector(
    (store) => store.organization.eventParticipants
  );
  // Setup local states with defaults
  const [toggleEdit, setToggleEdit] = useState(false);
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

  // Begin edit mode
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
    ); // End edit return
    // Begin non-edit mode
  } else {
    return (
      <CardNonEdit
        setToggleEdit={setToggleEdit}
        orgid={orgid}
        eventItem={eventItem}
      />
    );
  } // End non-edit return
} // End ScheduleCard

export default ScheduleCard;
