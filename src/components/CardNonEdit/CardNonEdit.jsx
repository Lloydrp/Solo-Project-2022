import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function CardNonEdit({ eventItem, orgid, setToggleEdit }) {
  // Setup router variables
  const dispatch = useDispatch();
  // Setup redux variables
  const participants = useSelector(
    (store) => store.organization.eventParticipants
  );
  const user = useSelector((store) => store.user);
  const userOrganization = user.organization_array?.find(
    (item) => item.organization_id === orgid
  );

  // Begin function to convert time
  function convertTimeFormat(time) {
    const year = time.slice(0, 4);
    const month = time.slice(5, 7);
    const day = time.slice(8, 11);
    return `${month}-${day}-${year}`;
  } // End convertTimeFormat

  // Begin function to handle deleting an event
  function handleDeleteEvent(id) {
    // Dispatch to saga to delete event
    dispatch({
      type: "DELETE_EVENT",
      payload: {
        id: id,
        organization_id: orgid,
      },
    });
  } // End handleDeleteEvent

  return (
    <Card className="os__shadow col-11 col-lg-3 mx-auto mx-lg-1 mb-3 text-white bg-primary text-center d-flex justify-content-between">
      <div className="card-header">
        <h5>{eventItem.event_name}</h5>
        <h5 className="m-0">{convertTimeFormat(eventItem.start_event)}</h5>
      </div>
      <span>
        {eventItem.event_description
          ? eventItem.event_description
          : "No description"}
      </span>
      <ListGroup className="list-group-flush">
        {participants?.map(
          (eventParticipants) =>
            Number(eventParticipants.event_id) === Number(eventItem.id) &&
            eventParticipants.participant_info.map(
              (eventParticipant, index) => (
                <ListGroup.Item
                  className="p-0 bg-primary text-white"
                  key={index}
                >
                  <span>
                    {`${eventParticipant.first_name} ${eventParticipant.last_name} `}
                  </span>
                  <span>
                    {`(${
                      eventParticipant.title_name
                        ? eventParticipant.title_name
                        : "No title"
                    })`}
                  </span>
                  <br />
                  <span>{`${eventParticipant.ep_event_duty}`}</span>
                </ListGroup.Item>
              )
            )
        )}
        {userOrganization.is_admin && (
          <>
            <button
              className="badge bg-info"
              onClick={() => setToggleEdit(true)}
            >
              Edit
            </button>
            <button
              className="badge bg-danger"
              onClick={() => handleDeleteEvent(eventItem.id)}
            >
              Delete
            </button>
          </>
        )}
      </ListGroup>
    </Card>
  );
}

export default CardNonEdit;
