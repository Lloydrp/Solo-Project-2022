import { useDispatch } from "react-redux";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

function UserOrgShowUsers({ orgTitles, orgUsers, setToggleShowUsers, organization }) {
  // Setup redux variables
  const dispatch = useDispatch();

  // Begin function to remove user from organization
  function handleRemoveFromOrg(id) {
    // Dispatch to saga to remove user from organization
    dispatch({
      type: "REMOVE_FROM_ORG",
      payload: {
        user_id: id,
        organization_id: organization.organization_id,
      },
    });
  } // End handleRemoveFromOrg

  return (
    <>
      <Button
        variant="info"
        size="sm"
        className="mt-1 mb-3"
        onClick={() => setToggleShowUsers(false)}
      >
        Hide users
      </Button>
      <ListGroup>
        {orgUsers.map((user, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex flex-column align-items-center"
          >
            <div className="">
              <div className="text-center fw-bold">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-center">
                Username: {user.username}
                <br />
                Title:{" "}
                {user.title
                  ? orgTitles[
                      orgTitles.findIndex((title) => title.id === user.title)
                    ]?.title_name
                  : "No Title"}
                <br />
                Admin: {user.is_admin ? "Yes" : "No"}
              </div>
            </div>
            <Button
              variant="danger"
              onClick={() => handleRemoveFromOrg(user.user_id)}
            >
              Remove
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button
        variant="info"
        size="sm"
        className="mt-1 mb-3"
        onClick={() => setToggleShowUsers(false)}
      >
        Hide users
      </Button>
    </>
  );
}

export default UserOrgShowUsers;
