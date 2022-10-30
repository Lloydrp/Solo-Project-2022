import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import NavbarComponent from "../../NavbarComponent/NavbarComponent";
import AddEventModal from "../../AddEventModal/AddEventModal";
import ScheduleCard from "../../ScheduleCard/ScheduleCard";
import ScheduleListUsers from "../../ScheduleListUsers/ScheduleListUsers";
import Nav from "react-bootstrap/Nav";

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
  const [filteredOrganization, setFilteredOrganization] = useState({
    orgEvents: [],
  });

  function handleFilterEvents(filter) {
    const date = new Date();
    if (filter === "all") {
      setFilteredOrganization({ ...organization });
    } else if (filter === "thismonth") {
      setFilteredOrganization({
        ...organization,
        orgEvents: organization.orgEvents.filter(
          (event) =>
            Number(event?.start_event.slice(5, 7)) ===
            Number(date.getMonth() + 1)
        ),
      });
    } else if (filter === "nextmonth") {
      setFilteredOrganization({
        ...organization,
        orgEvents: organization.orgEvents.filter(
          (event) =>
            Number(event?.start_event.slice(5, 7)) ===
            Number(date.getMonth() + 2)
        ),
      });
    } else {
      console.log("Error in handleFilterEvents");
    }
  }

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

  useEffect(() => {
    setFilteredOrganization({ ...organization });
  }, [organization]);

  return (
    <main>
      {toggleModal && (
        <AddEventModal
          toggleModal={toggleModal}
          orgid={params.orgid}
          setToggleModal={setToggleModal}
          shouldCloseOnOverlayClick={true}
        />
      )}
      <NavbarComponent orgid={params.orgid} />

      <section className="d-flex">
        {/* Begin nav user section */}
        <div className="os__listvh align-self-stretch bg-primary col-5 col-lg-3 border-end me-1">
          <ScheduleListUsers
            organization={organization}
            orgTitles={orgTitles}
          />
        </div>

        {/* Begin schedule card section */}
        <div className="col d-flex flex-column">
          {userOrganization.is_admin && (
            <button
              className="btn btn-success btn-sm mt-1 shadow"
              onClick={() => setToggleModal(true)}
            >
              Add Event
            </button>
          )}
          <Nav className="text-center align-self-center" variant="pills">
            <Nav.Item>
              <Nav.Link onClick={() => handleFilterEvents("all")}>All</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleFilterEvents("thismonth")}>
                This Month
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => handleFilterEvents("nextmonth")}>
                Next Month
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className="d-flex flex-wrap justify-content-evenly">
            {!filteredOrganization.orgEvents.includes(null) &&
              filteredOrganization.orgEvents.map((item, index) => (
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
