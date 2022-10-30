import { useDispatch } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

function UserOrgRemoveTitle({ organization, orgTitles, setToggleRemoveTitle }) {
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
      <span>Current Organization Titles:</span>
      <ListGroup>
        {orgTitles.map((title, index) => (
          <ListGroup.Item key={index}>
            <span className="me-3">{title.title_name}</span>
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
        className="mt-1 mb-3"
        onClick={() => setToggleRemoveTitle(false)}
      >
        Close Titles
      </Button>
    </>
  );
}

export default UserOrgRemoveTitle;
