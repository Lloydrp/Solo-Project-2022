import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import AddEventModal from "../../AddEventModal/AddEventModal";
import ScheduleCard from "../../ScheduleCard/ScheduleCard";
import ScheduleListUsers from "../../ScheduleListUsers/ScheduleListUsers";

function SchedulePage() {
  // Setup redux variables
  const organization = useSelector((store) => store.organization);
  const user = useSelector((store) => store.user);
  const orgTitles = useSelector((store) => store.organization.orgTitles);
  // Setup router variables
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  // Set current user organization
  const userOrganization = user.organization_array?.find(
    (item) => item.organization_id === params.orgid
  );
  // Setup local state for toggle
  const [toggleModal, setToggleModal] = useState(false);

  // Begin useEffect to validate user and get initial page load info
  useEffect(() => {
    // If user does not have current org ID in their user_accounts, redirect
    if (
      !user.organization_array.some(
        (item) => item.organization_id === params.orgid
      )
    ) {
      history.replace("/choose");
    }

    dispatch({ type: "FETCH_ORGANIZATION", payload: { id: params.orgid } });
    dispatch({
      type: "FETCH_TITLES",
      payload: {
        organization_id: params.orgid,
      },
    });
    dispatch({
      type: "FETCH_ORG_USERS",
      payload: { id: params.orgid },
    });
    dispatch({
      type: "FETCH_PARTICIPANTS",
      payload: { id: params.orgid },
    });
  }, []); // End useEffect to get initial load info

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

      <section className="d-flex">
        {/* Begin nav user section */}
        <div className="col-5 col-lg-3 vh-100 border-end me-1">
          <ScheduleListUsers
            organization={organization}
            orgTitles={orgTitles}
          />
        </div>

        {/* Begin schedule card section */}
        <div className="col-7 col-lg-9">
          {userOrganization.is_admin && (
            <button
              className="btn btn-info btn-sm mt-1"
              onClick={() => setToggleModal(true)}
            >
              Add Event
            </button>
          )}
          <nav>
            <ul className="org-nav">
              {"All This week Next Week This Month Next Month"}
            </ul>
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
