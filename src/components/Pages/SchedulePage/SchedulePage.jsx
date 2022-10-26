import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import AddEventModal from "../../AddEventModal/AddEventModal";
import ScheduleCard from "../../ScheduleCard/ScheduleCard";

function SchedulePage() {
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const params = useParams();
  const userOrganization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const [toggleModal, setToggleModal] = useState(false);

  function handleAddEvent() {
    setToggleModal(true);
  }

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
    dispatch({
      type: "FETCH_PARTICIPANTS",
      payload: { id: params.orgid },
    });
  }, []);

  return (
    <main>
      {toggleModal && (
        <AddEventModal
          orgid={params.orgid}
          setToggleModal={setToggleModal}
          shouldCloseOnOverlayClick={true}
        />
      )}
      <NavbarComponent orgid={params.orgid} />
      <section className="org-container">
        <nav>
          <ul>
            {organization.orgUsers?.map((item, index) => (
              <li key={index}>{`${item.first_name} ${item.last_name}`}</li>
            ))}
          </ul>
        </nav>
        <div className="org-sub-container">
          {userOrganization.is_admin && (
            <button onClick={handleAddEvent}>Add Event</button>
          )}
          <nav>
            <ul className="org-nav">{"Optional Nav for Filtering"}</ul>
          </nav>
          <div>
            {!organization.orgEvents.includes(null) &&
              organization.orgEvents.map((item, index) => (
                <ScheduleCard
                  key={index}
                  eventItem={item}
                  orgid={params.orgid}
                />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SchedulePage;
