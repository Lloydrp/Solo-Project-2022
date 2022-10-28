import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import LogOutButton from "../../LogOutButton/LogOutButton";
import ListGroup from "react-bootstrap/ListGroup";

// Import local image
const image = require("../../../images/organization-station-background.png");

function ChoosePage() {
  // Setup redux variables
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Setup router variables
  const history = useHistory();

  // Begin function to handle organization selection
  function handleOrgSelect(orgid) {
    //Send GET for all info from organization or at least events
    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: orgid } });
    history.push(`/schedule/${orgid}`);
  } // End handleOrgSelect

  return (
    <main
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        height: `100vh`,
        width: `100vw`,
      }}
      className="bg-image vw-100 d-flex flex-column justify-content-center align-items-center"
    >
      <div className="os__bg bg-light w-50 h-50 py-3 rounded-4 d-flex flex-column justify-content-center align-items-center">
        <h2 className="text-center text-primary mb-3">
          Choose your organization
        </h2>
        <ListGroup className="w-75 mb-3">
          {user.organization_array.length === 0 ? (
            <div className="mt-3">
              <h6>No organizations</h6>
            </div>
          ) : (
            user.organization_array.map((item, index) => (
              <ListGroup.Item
                className="list-unstyled text-center"
                key={index}
                action
                onClick={() => handleOrgSelect(Number(item.organization_id))}
              >
                {item.organization_name}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
        <button
          type="button"
          className="btn btn-primary mb-1 w-75"
          onClick={() => history.push("/create")}
        >
          Create Organization
        </button>
        <LogOutButton className={"w-75 btn btn-secondary"} />
      </div>
    </main>
  ); // End return
} // End ChoosePage

export default ChoosePage;
