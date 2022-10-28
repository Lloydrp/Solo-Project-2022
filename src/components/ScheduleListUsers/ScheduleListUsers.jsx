import ListGroup from "react-bootstrap/ListGroup";

function ScheduleListUsers({ organization, orgTitles }) {
  return (
    <ListGroup className="mx-1 mt-1">
      <h5 className="text-white text-center border-top border-start border-end mb-0 py-3">
        Organization users:
      </h5>
      {organization.orgUsers?.map((item, index) => (
        <ListGroup.Item key={index}>
          <div>
            {item.first_name} {item.last_name}
            <br />
            Username: {item.username}
            <br />
            {item.title
              ? orgTitles[
                  orgTitles.findIndex((title) => title.id === item.title)
                ]?.title_name
              : "No Title"}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default ScheduleListUsers;
