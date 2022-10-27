import ListGroup from "react-bootstrap/ListGroup";

function ScheduleListUsers({ organization, orgTitles }) {
  return (
    <ListGroup className="mx-1 mt-1">
      {organization.orgUsers?.map((item, index) => (
        <ListGroup.Item key={index}>
          <div>
            {item.first_name} {item.last_name}
            <br />
            {console.log("user :>> ", item)}
            {console.log("orgTitles :>> ", orgTitles)}
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
