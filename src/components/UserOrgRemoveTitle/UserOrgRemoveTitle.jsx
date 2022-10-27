import { useDispatch } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

function UserOrgRemoveTitle({ orgTitles, setToggleRemoveTitle }) {
  // Setup redux variables
  const dispatch = useDispatch();

  // Begin function to remove a title from organization
  function handleRemoveTitle(id) {
    // Dispatch to saga to remove title from organization
    dispatch({
      type: "REMOVE_TITLE",
      payload: {
        organization_id: organization.organization_id,
        title_id: id,
      },
    });
  } // End handleRemoveTitle
  return (
    <>
      <h5>Current Organization Titles:</h5>
      <ListGroup>
        {orgTitles.map((title, index) => (
          <ListGroup.Item key={index}>
            {title.title_name}{" "}
            <Button
              variant="danger"
              type="button"
              onClick={() => handleRemoveTitle(title.id)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button
        variant="info"
        className="mt-1"
        onClick={() => setToggleRemoveTitle(false)}
      >
        Close Titles
      </Button>
    </>
  );
}

export default UserOrgRemoveTitle;
