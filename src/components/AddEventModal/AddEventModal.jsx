import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function AddEventModal({ setToggleModal, orgid }) {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState();

  function handleAddEvent(event) {
    event.preventDefault();

    console.log({
      event_name: eventName,
      event_description: eventDescription,
      start_event: eventDate,
      organization_id: orgid,
    });

    setToggleModal(false);
  }

  return (
    <div className="modal-background" onClick={() => setToggleModal(false)}>
      <div
        className="modal-wrapper"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add Event</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleAddEvent}>
            <label htmlFor="eventName">
              Event Name:
              <input
                type="text"
                name="eventName"
                value={eventName}
                required
                onChange={(event) => setEventName(event.target.value)}
              />
            </label>
            <label htmlFor="eventDate">
              Event Date:
              <input
                type="date"
                name="eventDate"
                value={eventDate}
                required
                onChange={(event) => setEventDate(event.target.value)}
              />
            </label>
            <br />
            <label htmlFor="eventDescription">
              Event Description:
              <textarea
                type="text"
                name="eventDescription"
                value={eventDescription}
                onChange={(event) => setEventDescription(event.target.value)}
              />
            </label>
            <br />
            <button type="submit">Add Event</button>
            <button type="button" onClick={() => setToggleModal(false)}>
              Cancel
            </button>
          </form>
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
}

export default AddEventModal;
