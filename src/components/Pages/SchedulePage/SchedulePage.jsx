import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Nav from "../../Nav/Nav";

function SchedulePage() {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  console.log("organization :>> ", organization);

  useEffect(() => {
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: params.orgid } });
    dispatch({
      type: "FETCH_ORG_USERS",
      payload: { id: params.orgid },
    });
  }, []);

  return (
    <main>
      <Nav orgid={params.orgid} />
      <section className="org-container">
        <nav>
          <ul>
            {organization.orgUsers?.map((item) => (
              <li>{`${item.first_name} ${item.last_name}`}</li>
            ))}
          </ul>
        </nav>
        <div className="org-sub-container">
          <nav>
            <ul className="org-nav">{"Optional Nav for Filtering"}</ul>
          </nav>
          <div>
            {organization.orgEvents.map((item) => (
              <li>{`${item.event_name} ${item.start_event}`}</li>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SchedulePage;
